// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AgentNFT
 * @dev ERC-7857 iNFT implementation for AI agents with genetic traits
 * Each NFT represents ownership of an AI trading agent with specific traits
 */

contract AgentNFT {
    // ============= Structs =============

    struct AgentTraits {
        uint256 riskTolerance; // 1-10
        uint256 strategyAccuracy; // 0-100
        uint256 trendDetection; // 0-100
        uint256 executionSpeed; // 0-100 (ms to execute)
        uint256 recoveryRate; // 0-100 (ability to recover from losses)
        uint256 scalability; // 0-100 (ability to scale capital)
    }

    // ============= State Variables =============

    mapping(uint256 => AgentTraits) public traits;
    mapping(uint256 => uint256) public priceFloor; // Minimum price in wei
    mapping(uint256 => address) public nftOwners;
    mapping(uint256 => bool) public nftExists;
    mapping(address => uint256[]) public ownerNFTs;

    address public agentCapitalContract;
    address public admin;

    uint256 public totalSupply = 0;

    // ============= Events =============

    event NFTMinted(uint256 indexed agentId, address indexed owner, uint256 priceFloor);
    event TraitsUpdated(uint256 indexed agentId, AgentTraits newTraits);
    event NFTTransferred(uint256 indexed agentId, address from, address to);

    // ============= Constructor =============

    constructor() {
        admin = msg.sender;
    }

    // ============= iNFT Minting =============

    /**
     * @dev Mint iNFT for a new agent
     */
    function mint(address _to, uint256 _agentId, uint256 _baseAccuracy) external {
        require(msg.sender == agentCapitalContract, "Only AgentCapital can mint");
        require(!nftExists[_agentId], "NFT already exists");

        // Create traits based on base accuracy
        AgentTraits memory newTraits = AgentTraits({
            riskTolerance: 5,
            strategyAccuracy: _baseAccuracy,
            trendDetection: 60 + (pseudoRandom(_agentId) % 20),
            executionSpeed: 80 + (pseudoRandom(_agentId + 1) % 15),
            recoveryRate: _baseAccuracy / 2,
            scalability: 70
        });

        traits[_agentId] = newTraits;
        nftOwners[_agentId] = _to;
        nftExists[_agentId] = true;
        ownerNFTs[_to].push(_agentId);
        totalSupply++;

        // Calculate floor price based on traits
        priceFloor[_agentId] = calculateFloorPrice(newTraits);

        emit NFTMinted(_agentId, _to, priceFloor[_agentId]);
    }

    // ============= Trait Management =============

    /**
     * @dev Get traits for an agent
     */
    function getTraits(uint256 _agentId) external view returns (AgentTraits memory) {
        require(nftExists[_agentId], "NFT does not exist");
        return traits[_agentId];
    }

    /**
     * @dev Update traits when agent improves
     */
    function updateTraits(uint256 _agentId, AgentTraits memory _newTraits) external {
        require(msg.sender == agentCapitalContract, "Only AgentCapital can update");
        require(nftExists[_agentId], "NFT does not exist");

        traits[_agentId] = _newTraits;

        // Update price floor
        priceFloor[_agentId] = calculateFloorPrice(_newTraits);

        emit TraitsUpdated(_agentId, _newTraits);
    }

    /**
     * @dev Calculate price floor based on trait average
     */
    function calculateFloorPrice(AgentTraits memory _traits) public pure returns (uint256) {
        uint256 avgScore =
            (_traits.riskTolerance
                    + _traits.strategyAccuracy
                    + _traits.trendDetection
                    + _traits.executionSpeed
                    + _traits.recoveryRate
                    + _traits.scalability) / 6;

        // Price = (avgScore / 100) * 1 ether
        return (avgScore * 1 ether) / 100;
    }

    // ============= NFT Transfers =============

    /**
     * @dev Transfer NFT from one owner to another
     */
    function transfer(uint256 _agentId, address _from, address _to) external {
        require(msg.sender == _from, "Only owner can transfer");
        require(nftOwners[_agentId] == _from, "Not owner");
        require(nftExists[_agentId], "NFT does not exist");

        nftOwners[_agentId] = _to;

        // Update ownership arrays
        removeFromArray(ownerNFTs[_from], _agentId);
        ownerNFTs[_to].push(_agentId);

        emit NFTTransferred(_agentId, _from, _to);
    }

    // ============= Queries =============

    /**
     * @dev Get owner of an NFT
     */
    function ownerOf(uint256 _agentId) external view returns (address) {
        require(nftExists[_agentId], "NFT does not exist");
        return nftOwners[_agentId];
    }

    /**
     * @dev Get all NFTs owned by an address
     */
    function balanceOf(address _owner) external view returns (uint256) {
        return ownerNFTs[_owner].length;
    }

    /**
     * @dev Get NFTs owned by an address
     */
    function getNFTsByOwner(address _owner) external view returns (uint256[] memory) {
        return ownerNFTs[_owner];
    }

    /**
     * @dev Check if NFT exists
     */
    function exists(uint256 _agentId) external view returns (bool) {
        return nftExists[_agentId];
    }

    // ============= Utility Functions =============

    /**
     * @dev Pseudo-random number generator (not cryptographically secure)
     */
    function pseudoRandom(uint256 _seed) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_seed, block.timestamp, block.prevrandao))) % 100;
    }

    /**
     * @dev Remove element from array
     */
    function removeFromArray(uint256[] storage _array, uint256 _value) internal {
        for (uint256 i = 0; i < _array.length; i++) {
            if (_array[i] == _value) {
                _array[i] = _array[_array.length - 1];
                _array.pop();
                break;
            }
        }
    }

    // ============= Admin Functions =============

    /**
     * @dev Set AgentCapital contract address
     */
    function setAgentCapitalContract(address _agentCapitalContract) external {
        require(msg.sender == admin, "Only admin");
        agentCapitalContract = _agentCapitalContract;
    }
}
