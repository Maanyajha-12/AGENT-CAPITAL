// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ProofOfTrade
 * @dev Integration with 0G Compute for verifiable trading decisions
 * Records and verifies trade execution proofs from 0G TEE
 */

contract ProofOfTrade {
    // ============= Structs =============

    struct TradeProof {
        bytes32 proofId;
        uint256 tradeId;
        uint256 agentId;
        string tradeAction;
        uint256 expectedProfit;
        string proofHash; // SHA-256 from 0G Compute
        uint256 confidence; // 0-100
        bool verified;
        uint256 timestamp;
    }

    // ============= State Variables =============

    mapping(bytes32 => TradeProof) public proofs;
    mapping(uint256 => bytes32[]) public agentProofs; // agentId => proof IDs

    address public agentCapitalContract;
    address public admin;
    address public verifier; // 0G Compute verifier address

    uint256 public totalProofs = 0;
    uint256 public confidenceThreshold = 70; // Minimum confidence to execute trade

    // ============= Events =============

    event ProofRecorded(bytes32 indexed proofId, uint256 indexed agentId, string proofHash, uint256 confidence);
    event ProofVerified(bytes32 indexed proofId, bool verified);
    event TradeExecutionVerified(bytes32 indexed proofId, uint256 actualProfit, bool withinTolerance);

    // ============= Constructor =============

    constructor() {
        admin = msg.sender;
    }

    // ============= Proof Recording =============

    /**
     * @dev Record a proof from 0G Compute
     * Called after agent makes a trading decision verified in TEE
     */
    function recordProof(
        uint256 _agentId,
        uint256 _tradeId,
        string memory _action,
        uint256 _expectedProfit,
        string memory _proofHash,
        uint256 _confidence
    ) external returns (bytes32) {
        require(msg.sender == verifier || msg.sender == admin, "Only verifier can record");
        require(_confidence <= 100, "Confidence must be 0-100");

        bytes32 proofId = keccak256(abi.encodePacked(_agentId, _tradeId, block.timestamp));

        TradeProof memory proof = TradeProof({
            proofId: proofId,
            tradeId: _tradeId,
            agentId: _agentId,
            tradeAction: _action,
            expectedProfit: _expectedProfit,
            proofHash: _proofHash,
            confidence: _confidence,
            verified: _confidence >= confidenceThreshold,
            timestamp: block.timestamp
        });

        proofs[proofId] = proof;
        agentProofs[_agentId].push(proofId);
        totalProofs++;

        emit ProofRecorded(proofId, _agentId, _proofHash, _confidence);

        return proofId;
    }

    // ============= Proof Verification =============

    /**
     * @dev Verify that trade was executed as proven
     * Checks: confidence score, actual profit within tolerance
     */
    function verifyTradeExecution(bytes32 _proofId, uint256 _actualProfit) external view returns (bool) {
        require(proofExists(_proofId), "Proof does not exist");

        TradeProof memory proof = proofs[_proofId];

        // Check 1: Minimum confidence threshold
        if (proof.confidence < confidenceThreshold) {
            return false;
        }

        // Check 2: Actual profit within ±10% of expected
        uint256 tolerance = (proof.expectedProfit * 10) / 100;
        bool withinTolerance = _actualProfit
                >= (proof.expectedProfit > tolerance ? proof.expectedProfit - tolerance : 0)
            && _actualProfit <= (proof.expectedProfit + tolerance);

        return proof.verified && withinTolerance;
    }

    /**
     * @dev Get proof hash for audit
     */
    function getProofHash(bytes32 _proofId) external view returns (string memory) {
        require(proofExists(_proofId), "Proof does not exist");
        return proofs[_proofId].proofHash;
    }

    // ============= Queries =============

    /**
     * @dev Get proof details
     */
    function getProof(bytes32 _proofId) external view returns (TradeProof memory) {
        require(proofExists(_proofId), "Proof does not exist");
        return proofs[_proofId];
    }

    /**
     * @dev Get all proofs for an agent
     */
    function getAgentProofs(uint256 _agentId) external view returns (bytes32[] memory) {
        return agentProofs[_agentId];
    }

    /**
     * @dev Get agent proofs with details
     */
    function getAgentProofsWithDetails(uint256 _agentId) external view returns (TradeProof[] memory) {
        bytes32[] storage proofIds = agentProofs[_agentId];
        TradeProof[] memory result = new TradeProof[](proofIds.length);

        for (uint256 i = 0; i < proofIds.length; i++) {
            result[i] = proofs[proofIds[i]];
        }

        return result;
    }

    /**
     * @dev Get recent proofs for an agent
     */
    function getRecentAgentProofs(uint256 _agentId, uint256 _limit) external view returns (TradeProof[] memory) {
        bytes32[] storage proofIds = agentProofs[_agentId];
        uint256 length = proofIds.length < _limit ? proofIds.length : _limit;

        TradeProof[] memory result = new TradeProof[](length);

        for (uint256 i = 0; i < length; i++) {
            result[i] = proofs[proofIds[proofIds.length - 1 - i]];
        }

        return result;
    }

    /**
     * @dev Check if proof exists
     */
    function proofExists(bytes32 _proofId) public view returns (bool) {
        return proofs[_proofId].timestamp > 0;
    }

    /**
     * @dev Get average confidence for an agent
     */
    function getAverageConfidence(uint256 _agentId) external view returns (uint256) {
        bytes32[] storage proofIds = agentProofs[_agentId];

        if (proofIds.length == 0) return 0;

        uint256 totalConfidence = 0;
        for (uint256 i = 0; i < proofIds.length; i++) {
            totalConfidence += proofs[proofIds[i]].confidence;
        }

        return totalConfidence / proofIds.length;
    }

    /**
     * @dev Get proof success rate (verified / total)
     */
    function getProofSuccessRate(uint256 _agentId) external view returns (uint256) {
        bytes32[] storage proofIds = agentProofs[_agentId];

        if (proofIds.length == 0) return 0;

        uint256 verified = 0;
        for (uint256 i = 0; i < proofIds.length; i++) {
            if (proofs[proofIds[i]].verified) {
                verified++;
            }
        }

        return (verified * 100) / proofIds.length;
    }

    /**
     * @dev Get total proofs by agent
     */
    function getProofCount(uint256 _agentId) external view returns (uint256) {
        return agentProofs[_agentId].length;
    }

    // ============= Admin Functions =============

    /**
     * @dev Set verifier address (0G Compute service)
     */
    function setVerifier(address _verifier) external {
        require(msg.sender == admin, "Only admin");
        verifier = _verifier;
    }

    /**
     * @dev Set confidence threshold
     */
    function setConfidenceThreshold(uint256 _threshold) external {
        require(msg.sender == admin, "Only admin");
        require(_threshold <= 100, "Threshold must be 0-100");
        confidenceThreshold = _threshold;
    }

    /**
     * @dev Set AgentCapital contract address
     */
    function setAgentCapitalContract(address _agentCapitalContract) external {
        require(msg.sender == admin, "Only admin");
        agentCapitalContract = _agentCapitalContract;
    }

    /**
     * @dev Emergency: Invalidate a proof
     */
    function invalidateProof(bytes32 _proofId) external {
        require(msg.sender == admin, "Only admin");
        require(proofExists(_proofId), "Proof does not exist");
        proofs[_proofId].verified = false;
    }
}
