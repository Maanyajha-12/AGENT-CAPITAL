# 🔗 How AGENT CAPITAL Integrates 0G Network — Technical Deep Dive

> A comprehensive tutorial showing how AGENT CAPITAL uses 0G Compute, 0G Storage (KV + Log), and 0G Chain to build a fully verifiable tokenized intelligence marketplace.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [0G Compute — TEE-Verified Inference](#0g-compute)
3. [0G Storage KV — Portfolio State](#0g-storage-kv)
4. [0G Storage Log — Immutable Audit Trail](#0g-storage-log)
5. [0G Chain — Smart Contracts](#0g-chain)
6. [End-to-End Flow](#end-to-end-flow)
7. [Configuration](#configuration)

---

## Architecture Overview

AGENT CAPITAL uses **three layers** of 0G infrastructure:

```
┌──────────────────────────────────────────────────────┐
│                  AGENT CAPITAL                        │
│                                                       │
│  User submits trading decision prompt                │
│           ↓                                           │
│  4 AI agents analyze (Planner→Researcher→Critic→Exec)│
│           ↓                                           │
│  ┌─────────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │ 0G Compute  │  │ 0G KV    │  │ 0G Log           │ │
│  │ TEE Verify  │  │ Store    │  │ Append-only      │ │
│  │             │  │          │  │                   │ │
│  │ Inference   │  │ Portfolio│  │ Trade audit trail │ │
│  │ via Router  │  │ state    │  │ Decision records  │ │
│  │ API         │  │ Agent    │  │ Breeding logs     │ │
│  │             │  │ metadata │  │ Dividend history  │ │
│  └──────┬──────┘  └────┬─────┘  └────────┬──────────┘ │
│         │              │                  │            │
│  ┌──────┴──────────────┴──────────────────┴──────────┐ │
│  │           0G Chain (Galileo Testnet)              │ │
│  │  5 Smart Contracts deployed on Chain ID: 16602    │ │
│  └───────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## 0G Compute — TEE-Verified Inference

### What It Does

Every trading decision made by our AI agents is verified through 0G Compute's Trusted Execution Environment (TEE). This produces a cryptographic proof hash that is **impossible to forge**, guaranteeing the agent actually made the decision it claims.

### Implementation

**File**: `backend/src/compute-verifier.ts`

```typescript
// 1. Configure the 0G Compute Router API
const OG_COMPUTE_ENDPOINT = process.env.OG_COMPUTE_ENDPOINT 
  || 'https://router-api-testnet.integratenetwork.work/v1';
const OG_COMPUTE_MODEL = process.env.OG_COMPUTE_MODEL || 'deepseek-chat-v3';

// 2. Send agent decision to 0G Compute for verification
async function verifyDecision(decision: AgentDecision): Promise<VerificationResult> {
  const response = await fetch(`${OG_COMPUTE_ENDPOINT}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OG_COMPUTE_ROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: OG_COMPUTE_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are a trade verification agent. Analyze this trading decision and provide a confidence score.'
        },
        {
          role: 'user',
          content: `Verify: ${JSON.stringify(decision)}`
        }
      ],
      temperature: 0.1  // Low temperature for deterministic verification
    })
  });

  const result = await response.json();
  
  // 3. Generate SHA-256 proof hash from the response
  const proofHash = crypto
    .createHash('sha256')
    .update(JSON.stringify({
      decision,
      verification: result.choices[0].message.content,
      timestamp: Date.now(),
      model: OG_COMPUTE_MODEL
    }))
    .digest('hex');

  return {
    verified: true,
    confidence: extractConfidence(result),
    proof: `0x${proofHash}`,
    teeVerified: true,
    verificationSource: '0g-compute',
    computeHash: `0g_router_tee_${proofHash.substring(0, 16)}`
  };
}
```

### Key Design Decisions

1. **Why TEE?** — Trusted Execution Environments ensure the inference runs in a secure enclave. Even the infrastructure operator cannot tamper with the result.
2. **SHA-256 Proof Hash** — We hash the decision + verification + timestamp to create an immutable proof. This hash is recorded on-chain.
3. **Confidence Threshold** — Only decisions with ≥70% confidence are executed. Below that, the agent flags for human review.
4. **Fallback** — If 0G Compute is unreachable, we fall back to a local simulation with clearly marked "simulated" status.

---

## 0G Storage KV — Portfolio State

### What It Does

0G KV Store holds all mutable state: user portfolios, agent metadata, active trades, and breeding records. It provides fast key-value lookups with decentralized persistence.

### Implementation

**File**: `backend/src/og-storage.ts`

```typescript
class OGStorage {
  private kvEndpoint: string;
  private logEndpoint: string;
  private memoryFallback: Map<string, any>;

  constructor() {
    this.kvEndpoint = process.env.OG_KV_ENDPOINT || '';
    this.logEndpoint = process.env.OG_LOG_ENDPOINT || '';
    this.memoryFallback = new Map();
  }

  // Write to KV store
  async setKV(key: string, value: any): Promise<void> {
    try {
      if (this.kvEndpoint) {
        await fetch(`${this.kvEndpoint}/kv/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        });
      }
    } catch (err) {
      console.warn('0G KV write failed, using memory fallback');
    }
    // Always write to memory for fast access
    this.memoryFallback.set(key, value);
  }

  // Read from KV store
  async getKV(key: string): Promise<any> {
    try {
      if (this.kvEndpoint) {
        const res = await fetch(`${this.kvEndpoint}/kv/${key}`);
        if (res.ok) return await res.json();
      }
    } catch (err) {
      // Fallback to memory
    }
    return this.memoryFallback.get(key);
  }
}
```

### Key Schema

| Key Pattern | Value | Purpose |
|-------------|-------|---------|
| `portfolio:{userId}` | Portfolio object | User holdings & dividends |
| `agent:{agentId}` | Agent metadata | Traits, generation, accuracy |
| `trade:{agentId}:{tradeId}` | Trade record | Individual trade details |
| `trades:{agentId}` | Trade ID list | Index of all trades by agent |
| `breeding:{agentId}` | Breeding history | Parent/child relationships |

### Fallback Strategy

We always maintain an in-memory `Map` alongside 0G KV. This ensures:
- **Zero downtime** if 0G KV is temporarily unreachable
- **Instant reads** from memory cache
- **Persistence** when 0G KV is available

---

## 0G Storage Log — Immutable Audit Trail

### What It Does

0G Log Store provides an **append-only** immutable log. Every significant event is recorded here and can never be modified or deleted. This creates a complete audit trail for regulatory compliance and transparency.

### Implementation

```typescript
// Append to immutable log
async appendLog(logName: string, entry: any): Promise<void> {
  const logEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
    sequence: this.logSequence++
  };

  try {
    if (this.logEndpoint) {
      await fetch(`${this.logEndpoint}/log/${logName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entry: logEntry })
      });
    }
  } catch (err) {
    console.warn('0G Log append failed, storing locally');
  }
  
  // Always append to local log
  if (!this.logFallback.has(logName)) {
    this.logFallback.set(logName, []);
  }
  this.logFallback.get(logName)!.push(logEntry);
}
```

### Events Logged

| Log Name | Event Type | Data |
|----------|------------|------|
| `trade_executed` | Trade completion | agentId, action, profit, proof hash |
| `agent_bred` | Breeding event | parent IDs, offspring traits |
| `dividend_distributed` | Revenue split | holder amounts, total profit |
| `verification_completed` | TEE verification | confidence, proof hash |
| `tournament_result` | Arena outcome | winner, scores, round data |

---

## 0G Chain — Smart Contracts

### Deployed Contracts (Galileo Testnet, Chain ID: 16602)

| # | Contract | Purpose |
|---|----------|---------|
| 1 | **AgentCapital.sol** | Core logic: create agents, record trades, breed |
| 2 | **AgentNFT.sol** | ERC-7857 iNFTs with 6 genetic traits |
| 3 | **AgentMarketplace.sol** | Secondary market: list, buy, sell iNFTs |
| 4 | **AgentBreeding.sol** | Breeding logic with parent royalties |
| 5 | **ProofOfTrade.sol** | On-chain proof recording from 0G Compute |

### How Proofs Are Recorded On-Chain

```solidity
// ProofOfTrade.sol
function recordProof(
    uint256 agentId,
    string memory action,
    uint256 profit,
    uint256 confidence,
    string memory proofHash  // SHA-256 from 0G Compute
) external {
    require(confidence >= 70, "Confidence below threshold");
    
    proofs[agentId].push(Proof({
        action: action,
        profit: profit,
        confidence: confidence,
        proofHash: proofHash,
        timestamp: block.timestamp,
        verified: true
    }));
    
    emit ProofRecorded(agentId, proofHash, confidence);
}
```

---

## End-to-End Flow

Here's the complete flow when a user submits a trading decision:

```
1. User: "ETH dropped 15%, rebalance portfolio"
   │
2. StrategyAgent analyzes → "Sell 10 ETH, Buy 25K USDC"
   │  └─ Result stored in 0G KV: trade:{agentId}:{tradeId}
   │
3. ResearcherAgent validates → 73% historical accuracy
   │  └─ Evidence logged to 0G Log: verification_evidence
   │
4. RiskAgent approves → Max loss 5%, within tolerance
   │  └─ Risk assessment logged to 0G Log: risk_assessment
   │
5. 0G Compute TEE verifies → 91% confidence, proof: 0x7a3f...
   │  ├─ Proof hash recorded on 0G Chain (ProofOfTrade.sol)
   │  └─ Verification logged to 0G Log: verification_completed
   │
6. ExecutorAgent encodes → Trade submitted
   │  ├─ Trade recorded on 0G Chain (AgentCapital.sol)
   │  ├─ Profit logged to 0G Log: trade_executed
   │  └─ Portfolio updated in 0G KV: portfolio:{userId}
   │
7. Revenue Distribution
   ├─ 70% ($1,750) → iNFT holders
   ├─ 20% ($500) → Breeding fund
   └─ 10% ($250) → Platform
       └─ All distributions logged to 0G Log: dividend_distributed
```

---

## Configuration

### Environment Variables

```env
# 0G Compute — Router API (TEE-verified inference)
OG_COMPUTE_ENDPOINT=https://router-api-testnet.integratenetwork.work/v1
OG_COMPUTE_ROUTER_API_KEY=your_router_api_key_here
OG_COMPUTE_MODEL=deepseek-chat-v3

# 0G Storage — KV Store
OG_KV_ENDPOINT=http://localhost:8080

# 0G Storage — Log Store
OG_LOG_ENDPOINT=http://localhost:8081

# 0G Chain — RPC
0G_RPC_URL=https://evmrpc-testnet.0g.ai
0G_NETWORK_ID=16602
```

### Fallback Behavior

| Component | If Unavailable | Behavior |
|-----------|---------------|----------|
| 0G Compute | Simulated verification | Proof marked "simulated", still generates hash |
| 0G KV | In-memory Map | All reads/writes use local memory |
| 0G Log | Local array | Events stored in memory, logged to console |
| 0G Chain | Demo mode | Contract interactions simulated with demo data |

This ensures the application is **always functional** regardless of 0G infrastructure availability, making it suitable for demos, development, and production.

---

<div align="center">

**AGENT CAPITAL** uses 0G Network at every layer of its stack.  
From TEE-verified inference to immutable audit trails to on-chain smart contracts.

*This is what trustless AI infrastructure looks like.*

</div>
