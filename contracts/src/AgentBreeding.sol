// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AgentBreeding
 * @dev Manages agent breeding, genetic trait inheritance, and parent royalties
 */

contract AgentBreeding {
    // ============= Structs =============

    struct BreedingRecord {
        uint256 breedingId;
        uint256 parent1;
        uint256 parent2;
        uint256 childId;
        address breeder;
        uint256 timestamp;
        uint256 breedingFee;
    }

    // ============= State Variables =============

    BreedingRecord[] public breedings;
    mapping(uint256 => mapping(uint256 => uint256)) public parentRoyalties; // childId => (parentId => percentage in basis points)
    mapping(uint256 => uint256[]) public offspringOf; // parentId => list of children

    address public agentCapitalContract;
    address public nftContract;
    address public admin;

    uint256 public breedingFee = 0.5 ether; // Initial breeding fee
    uint256 public parentRoyaltyPercentage = 25; // 2.5% (in basis points: 250 = 2.5%)

    // ============= Events =============

    event BreedingRequested(
        uint256 indexed breedingId, uint256 indexed parent1, uint256 indexed parent2, address breeder
    );
    event BreedingCompleted(uint256 indexed breedingId, uint256 indexed childId, uint256 accuracy);
    event RoyaltyDistributed(uint256 indexed childAgentId, uint256 indexed parentId, uint256 amount);

    // ============= Constructor =============

    constructor() {
        admin = msg.sender;
    }

    // ============= Breeding =============

    /**
     * @dev Request breeding between two agents
     * Both agents must have accuracy >= 75%
     */
    function requestBreeding(uint256 _parent1, uint256 _parent2) external payable returns (uint256) {
        require(_parent1 != _parent2, "Cannot breed with self");
        require(msg.value >= breedingFee, "Insufficient breeding fee");

        // In production, verify parent accuracy via AgentCapital contract
        // require(agentCapital.getAccuracy(_parent1) >= 75, "Parent 1 unqualified");
        // require(agentCapital.getAccuracy(_parent2) >= 75, "Parent 2 unqualified");

        uint256 breedingId = breedings.length;

        BreedingRecord memory record = BreedingRecord({
            breedingId: breedingId,
            parent1: _parent1,
            parent2: _parent2,
            childId: 0, // Set by completeBreeding
            breeder: msg.sender,
            timestamp: block.timestamp,
            breedingFee: msg.value
        });

        breedings.push(record);

        emit BreedingRequested(breedingId, _parent1, _parent2, msg.sender);

        return breedingId;
    }

    /**
     * @dev Complete breeding and create new agent (called by admin after verification)
     */
    function completeBreeding(uint256 _breedingId, uint256 _childAgentId, uint256 _childAccuracy) external {
        require(msg.sender == admin, "Only admin can complete breeding");
        require(_breedingId < breedings.length, "Invalid breeding ID");

        BreedingRecord storage breeding = breedings[_breedingId];
        require(breeding.childId == 0, "Breeding already completed");

        breeding.childId = _childAgentId;

        // Set parent royalties (2.5% each in basis points)
        parentRoyalties[_childAgentId][breeding.parent1] = 250; // 2.5%
        parentRoyalties[_childAgentId][breeding.parent2] = 250; // 2.5%

        // Record offspring
        offspringOf[breeding.parent1].push(_childAgentId);
        offspringOf[breeding.parent2].push(_childAgentId);

        // Transfer breeding fee to platform treasury (admin)
        payable(admin).transfer(breeding.breedingFee);

        emit BreedingCompleted(_breedingId, _childAgentId, _childAccuracy);
    }

    // ============= Royalty Distribution =============

    /**
     * @dev Distribute parent royalties when child agent generates revenue
     */
    function distributeParentRoyalties(uint256 _childAgentId, uint256 _revenue) external {
        require(msg.sender == agentCapitalContract, "Only AgentCapital can call");
        require(_revenue > 0, "Revenue must be > 0");

        // Get parent info from breedings
        uint256 parent1 = 0;
        uint256 parent2 = 0;

        for (uint256 i = 0; i < breedings.length; i++) {
            if (breedings[i].childId == _childAgentId) {
                parent1 = breedings[i].parent1;
                parent2 = breedings[i].parent2;
                break;
            }
        }

        if (parent1 > 0 && parentRoyalties[_childAgentId][parent1] > 0) {
            uint256 parent1Royalty = (_revenue * parentRoyalties[_childAgentId][parent1]) / 10000;
            // In production: transfer to parent1 owner
            emit RoyaltyDistributed(_childAgentId, parent1, parent1Royalty);
        }

        if (parent2 > 0 && parentRoyalties[_childAgentId][parent2] > 0) {
            uint256 parent2Royalty = (_revenue * parentRoyalties[_childAgentId][parent2]) / 10000;
            // In production: transfer to parent2 owner
            emit RoyaltyDistributed(_childAgentId, parent2, parent2Royalty);
        }
    }

    // ============= Queries =============

    /**
     * @dev Get breeding record
     */
    function getBreedingRecord(uint256 _breedingId) external view returns (BreedingRecord memory) {
        require(_breedingId < breedings.length, "Invalid breeding ID");
        return breedings[_breedingId];
    }

    /**
     * @dev Get offspring of a parent agent
     */
    function getOffspring(uint256 _parentAgentId) external view returns (uint256[] memory) {
        return offspringOf[_parentAgentId];
    }

    /**
     * @dev Get offspring count for a parent
     */
    function getOffspringCount(uint256 _parentAgentId) external view returns (uint256) {
        return offspringOf[_parentAgentId].length;
    }

    /**
     * @dev Get parent royalty percentage for child agent
     */
    function getParentRoyalty(uint256 _childAgentId, uint256 _parentAgentId) external view returns (uint256) {
        return parentRoyalties[_childAgentId][_parentAgentId];
    }

    /**
     * @dev Get total breedings
     */
    function getTotalBreedings() external view returns (uint256) {
        return breedings.length;
    }

    /**
     * @dev Get breeding compatibility score (higher accuracy = better genetics)
     */
    function getCompatibilityScore(uint256 _accuracy1, uint256 _accuracy2) external pure returns (uint256) {
        // Simple compatibility: average of both accuracies
        return (_accuracy1 + _accuracy2) / 2;
    }

    // ============= Admin Functions =============

    /**
     * @dev Set breeding fee
     */
    function setBreedingFee(uint256 _newFee) external {
        require(msg.sender == admin, "Only admin");
        breedingFee = _newFee;
    }

    /**
     * @dev Set parent royalty percentage (in basis points)
     */
    function setParentRoyaltyPercentage(uint256 _percentage) external {
        require(msg.sender == admin, "Only admin");
        require(_percentage <= 500, "Percentage too high"); // Max 5%
        parentRoyaltyPercentage = _percentage;
    }

    /**
     * @dev Set AgentCapital contract address
     */
    function setAgentCapitalContract(address _agentCapitalContract) external {
        require(msg.sender == admin, "Only admin");
        agentCapitalContract = _agentCapitalContract;
    }

    /**
     * @dev Set NFT contract address
     */
    function setNFTContract(address _nftContract) external {
        require(msg.sender == admin, "Only admin");
        nftContract = _nftContract;
    }
}
