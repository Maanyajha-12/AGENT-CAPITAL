// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AgentCapital
 * @dev Core contract for AGENT CAPITAL - The Tokenized Intelligence Marketplace
 * Manages agent creation, trading execution, profit tracking, and revenue distribution
 */

contract AgentCapital {
    // ============= Structs =============

    struct Agent {
        uint256 agentId;
        address creator;
        string strategyType; // "YieldOptimizer", "ArbitrageHunter", "TrendFollower", "RiskManager"
        uint256 totalCapital;
        uint256 totalRevenue;
        uint256 accuracy; // 0-100
        uint256 generation;
        uint256 lastTradedAt;
        bool isActive;
    }

    struct Trade {
        uint256 tradeId;
        uint256 agentId;
        string action; // "BUY_ETH", "SELL_USDC", etc
        uint256 amount;
        uint256 profit;
        string proofHash; // From 0G Compute
        uint256 timestamp;
        bool executed;
    }

    struct AgentMetrics {
        uint256 totalRevenue;
        uint256 accuracy;
        uint256 generation;
        uint256 tradeCount;
        uint256 winRate; // Percentage of winning trades
        uint256 lastTradeProfit;
        uint256 averageTradeProfit;
    }

    // ============= State Variables =============

    mapping(uint256 => Agent) public agents;
    mapping(uint256 => Trade[]) public trades;
    mapping(uint256 => mapping(uint256 => uint256)) public parentRoyalties; // childId => (parentId => percentage)
    mapping(uint256 => uint256) public dividendsPaid; // agentId => total dividends paid

    // investor => agentId => amount (in wei)
    mapping(address => mapping(uint256 => uint256)) public investments;

    uint256 public agentCounter = 1;
    uint256 public tradeCounter = 1;

    address public iNFTContract;
    address public admin;

    uint256 constant HOLDER_SHARE = 70; // 70% to holders
    uint256 constant BREEDING_FUND = 20; // 20% to breeding fund
    uint256 constant PLATFORM_FEE = 10; // 10% platform fee

    // ============= Events =============

    event AgentCreated(uint256 indexed agentId, address creator, string strategyType);
    event TradeExecuted(uint256 indexed agentId, uint256 indexed tradeId, uint256 profit, string proofHash);
    event DividendsPaid(uint256 indexed agentId, uint256 amount);
    event AgentsBred(uint256 indexed parent1, uint256 indexed parent2, uint256 indexed childId);
    event InvestmentReceived(address indexed investor, uint256 indexed agentId, uint256 amount);

    // ============= Constructor =============

    constructor() {
        admin = msg.sender;
    }

    // ============= Investment =============

    /**
     * @dev Invest native 0G in an agent. Funds are held by this contract.
     *      FROM: msg.sender (investor)
     *      TO:   address(this) (AgentCapital contract)
     */
    function invest(uint256 agentId) external payable {
        require(msg.value > 0, "Must send 0G to invest");
        investments[msg.sender][agentId] += msg.value;
        agents[agentId].totalCapital += msg.value;
        emit InvestmentReceived(msg.sender, agentId, msg.value);
    }

    /**
     * @dev Accept plain ETH/0G transfers (e.g., direct sends without calldata)
     */
    receive() external payable {}

    /**
     * @dev Get investor's balance for a specific agent
     */
    function getUserInvestment(address investor, uint256 agentId) external view returns (uint256) {
        return investments[investor][agentId];
    }

    // ============= Agent Creation =============

    /**
     * @dev Create a new trading agent
     */
    function createAgent(string memory _strategyType, uint256 _initialCapital) external returns (uint256) {
        uint256 agentId = agentCounter++;

        agents[agentId] = Agent({
            agentId: agentId,
            creator: msg.sender,
            strategyType: _strategyType,
            totalCapital: _initialCapital,
            totalRevenue: 0,
            accuracy: 50, // Start at neutral 50%
            generation: 0,
            lastTradedAt: 0,
            isActive: true
        });

        emit AgentCreated(agentId, msg.sender, _strategyType);
        return agentId;
    }

    // ============= Trade Execution =============

    /**
     * @dev Record a trade executed by an agent (called after 0G Compute verification)
     */
    function recordTrade(
        uint256 _agentId,
        string memory _action,
        uint256 _amount,
        uint256 _profit,
        string memory _proofHash
    ) external {
        require(agents[_agentId].isActive, "Agent not active");

        Trade memory trade = Trade({
            tradeId: tradeCounter++,
            agentId: _agentId,
            action: _action,
            amount: _amount,
            profit: _profit,
            proofHash: _proofHash,
            timestamp: block.timestamp,
            executed: true
        });

        trades[_agentId].push(trade);

        agents[_agentId].totalRevenue += _profit;
        agents[_agentId].lastTradedAt = block.timestamp;

        // Update accuracy (improve if profitable)
        if (_profit > 0 && agents[_agentId].accuracy < 95) {
            agents[_agentId].accuracy += 1;
        } else if (_profit < 0 && agents[_agentId].accuracy > 5) {
            agents[_agentId].accuracy -= 1;
        }

        // Distribute dividends
        distributeDividends(_agentId, _profit);

        emit TradeExecuted(_agentId, trade.tradeId, _profit, _proofHash);
    }

    // ============= Revenue Distribution =============

    /**
     * @dev Distribute trade profits to stakeholders
     */
    function distributeDividends(uint256 _agentId, uint256 _profit) internal {
        if (_profit == 0) return;

        uint256 holderShare = (_profit * HOLDER_SHARE) / 100;
        uint256 breedingFund = (_profit * BREEDING_FUND) / 100;
        uint256 platformFee = (_profit * PLATFORM_FEE) / 100;

        // In production, send holderShare to iNFT holders proportionally
        // Send breedingFund to breeding pool
        // Send platformFee to admin

        dividendsPaid[_agentId] += holderShare;

        emit DividendsPaid(_agentId, holderShare);
    }

    // ============= Agent Breeding =============

    /**
     * @dev Breed two agents to create an improved offspring
     * Both parents must have accuracy >= 75%
     */
    function breedAgents(uint256 _parent1, uint256 _parent2) external returns (uint256) {
        require(agents[_parent1].isActive, "Parent 1 not active");
        require(agents[_parent2].isActive, "Parent 2 not active");
        require(agents[_parent1].accuracy >= 75, "Parent 1 insufficient accuracy");
        require(agents[_parent2].accuracy >= 75, "Parent 2 insufficient accuracy");

        uint256 childId = agentCounter++;

        // Create child with blended traits
        uint256 childAccuracy = (agents[_parent1].accuracy + agents[_parent2].accuracy) / 2;
        uint256 childGeneration = max(agents[_parent1].generation, agents[_parent2].generation) + 1;

        agents[childId] = Agent({
            agentId: childId,
            creator: msg.sender,
            strategyType: agents[_parent1].strategyType,
            totalCapital: 0,
            totalRevenue: 0,
            accuracy: childAccuracy,
            generation: childGeneration,
            lastTradedAt: 0,
            isActive: true
        });

        // Set parent royalties (2.5% each)
        parentRoyalties[childId][_parent1] = 25; // 2.5%
        parentRoyalties[childId][_parent2] = 25; // 2.5%

        emit AgentsBred(_parent1, _parent2, childId);

        return childId;
    }

    // ============= Metrics & Queries =============

    /**
     * @dev Get comprehensive metrics for an agent
     */
    function getAgentMetrics(uint256 _agentId) external view returns (AgentMetrics memory) {
        Agent memory agent = agents[_agentId];
        Trade[] storage agentTrades = trades[_agentId];

        uint256 winRate = 0;
        uint256 totalWins = 0;
        uint256 totalProfit = 0;

        for (uint256 i = 0; i < agentTrades.length; i++) {
            if (agentTrades[i].profit > 0) {
                totalWins++;
            }
            totalProfit += agentTrades[i].profit;
        }

        if (agentTrades.length > 0) {
            winRate = (totalWins * 100) / agentTrades.length;
        }

        uint256 avgProfit = agentTrades.length > 0 ? totalProfit / agentTrades.length : 0;

        return AgentMetrics({
            totalRevenue: agent.totalRevenue,
            accuracy: agent.accuracy,
            generation: agent.generation,
            tradeCount: agentTrades.length,
            winRate: winRate,
            lastTradeProfit: agentTrades.length > 0 ? agentTrades[agentTrades.length - 1].profit : 0,
            averageTradeProfit: avgProfit
        });
    }

    /**
     * @dev Get agent details
     */
    function getAgent(uint256 _agentId) external view returns (Agent memory) {
        return agents[_agentId];
    }

    /**
     * @dev Get trade history for an agent
     */
    function getTrades(uint256 _agentId, uint256 _limit) external view returns (Trade[] memory) {
        Trade[] storage agentTrades = trades[_agentId];
        uint256 length = agentTrades.length < _limit ? agentTrades.length : _limit;

        Trade[] memory result = new Trade[](length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = agentTrades[agentTrades.length - 1 - i];
        }
        return result;
    }

    /**
     * @dev Get total agents created
     */
    function getTotalAgents() external view returns (uint256) {
        return agentCounter - 1;
    }

    /**
     * @dev Utility function to get max of two numbers
     */
    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    // ============= Admin Functions =============

    /**
     * @dev Set iNFT contract address (for integration)
     */
    function setINFTContract(address _iNFTContract) external {
        require(msg.sender == admin, "Only admin");
        iNFTContract = _iNFTContract;
    }

    /**
     * @dev Emergency: deactivate an agent
     */
    function deactivateAgent(uint256 _agentId) external {
        require(msg.sender == admin, "Only admin");
        agents[_agentId].isActive = false;
    }
}
