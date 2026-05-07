# 🏗️ AGENT CAPITAL - Complete System Architecture

## System Overview

AGENT CAPITAL is a tokenized intelligence marketplace built on 0G Network where autonomous AI trading agents are minted as iNFTs, generate verified yield through multi-stage trading decisions, and distribute profits to token holders.

---

## 📊 Architecture Layers

### Layer 1: User Interface (Vercel Frontend)
- **Portfolio Dashboard**: View holdings, earnings, portfolio metrics
- **Marketplace**: Browse agent iNFTs, price discovery, trading interface
- **Strategy Panel**: Monitor agent strategy execution in real-time
- **Gallery**: View agents with genetic traits visualization
- **Analytics**: Platform statistics, leaderboards, performance metrics

**Technologies**: React TypeScript, TailwindCSS, Framer Motion, WebSocket

---

### Layer 2: Backend API (Express.js)
```
/api/portfolio/        - User portfolio management
/api/agent/           - Agent metrics, trades, breeding
/api/platform/        - Economics, leaderboard, volume
/api/health          - System health check
/ws                  - WebSocket for real-time updates
```

**Key Services**:
- `PortfolioManager`: Tracks user holdings and dividends
- `AgentEconomicsTracker`: Calculates agent performance and platform economics
- `WebSocketManager`: Real-time price/earnings updates

---

### Layer 3: Chain Layer (0G Galileo Testnet)

#### 5 Core Smart Contracts:

1. **AgentCapital.sol** (Core Logic)
   - `createAgent()` - Deploy new trading agent
   - `recordTrade()` - Log executed trades with 0G proof
   - `breedAgents()` - Create offspring from high-performers
   - `getAgentMetrics()` - Fetch performance data
   - **Key Feature**: Accuracy improves/degrades based on trade profit/loss

2. **AgentNFT.sol** (ERC-7857 iNFTs)
   - Mint iNFTs with 6 genetic traits
   - `traits`: riskTolerance, strategyAccuracy, trendDetection, executionSpeed, recoveryRate, scalability
   - Token pricing based on average trait score
   - Support transfer/trading

3. **AgentMarketplace.sol** (Secondary Markets)
   - `listAgent()` - Seller posts agent for sale
   - `buyAgent()` - Buyer purchases iNFT
   - 5% platform fee on trades
   - Price history tracking
   - **Price Discovery**: Better performers command premium prices

4. **AgentBreeding.sol** (Evolution)
   - `requestBreeding()` - High-accuracy agents (75%+) can breed
   - 0.5 0G breeding fee
   - Offspring accuracy = (parent1 + parent2) / 2 (±1% mutation)
   - **Parent Royalties**: Each parent earns 2.5% of child's lifetime revenue

5. **ProofOfTrade.sol** (0G Compute Integration)
   - Receives SHA-256 proofs from 0G Compute TEE
   - Verifies trade execution confidence (must be ≥70%)
   - Validates actual profit within ±10% of expected
   - `confidenceThreshold` = 70%
   - Immutable audit trail

---

### Layer 4: 0G Infrastructure

#### 0G Storage (Persistent State)
```
Key-Value Store:
- portfolio:{userId}           → User holdings & dividends
- agent:{agentId}             → Agent traits, metadata
- trade:{agentId}:{tradeId}   → Trade records
- trades:{agentId}            → List of trade IDs
- breeding:{agentId}          → Breeding history

Log Store (Immutable Audit Trail):
- log:trade_executed:{timestamp}
- log:agent_bred:{timestamp}
- log:dividend_distributed:{timestamp}
- log:portfolio_updated:{timestamp}
```

#### 0G Compute (TEE Verification)
```
Flow:
1. Agent decides trade: "Sell 10 ETH, Buy 25,000 USDC"
2. Backend sends decision to 0G Compute Router API
3. Inference runs in TEE
4. Returns SHA-256 proof hash + confidence score
5. Backend records proof on-chain via ProofOfTrade contract
6. Trade marked as "verified" and executed
```

#### 0G Chain (Smart Contracts)
- Deploy 5 contracts to 0G Galileo Testnet
- Handle all economic transactions (trades, breeding, marketplace)
- Immutable record of agent performance

---

## 💰 Economic Model

### Revenue Distribution (per trade profit)
```
Single Trade: $1,000 profit
├─ 70% → iNFT Holders ($700) - distributed proportionally
├─ 20% → Breeding Fund ($200) - for new agent creation
└─ 10% → Platform Fee ($100)
```

### Agent Lifecycle Economics
```
Stage 1: Creation
- Cost: Free (creator pays small tx fee)
- Agent launches with 50% accuracy
- Ready to receive capital

Stage 2: Trading
- Month 1: 10 trades, 7 wins, $17,500 profit
- Accuracy improves: 50% → 57% (7 wins out of 10)
- Revenue split:
  * Holders: $12,250 (70%)
  * Breeding fund: $3,500 (20%)
  * Platform: $1,750 (10%)

Stage 3: Breeding Eligibility
- Accuracy ≥ 75% = eligible to breed
- Partner with another 75%+ agent
- Create offspring (Gen 1)
- Either parent: earn 2.5% of child's lifetime revenue

Stage 4: Market Maturation
- High performers reach 85%+ accuracy
- iNFT price increases (floor price = avg trait score)
- Investors can:
  * Buy undervalued agents, wait for performance improvement, sell high
  * Hold for yield (monthly dividends)
  * Breed for passive parent royalties
```

### Platform Economics (Year 1 Projections)
```
Assumptions:
- 50 agents deployed
- Average TVL per agent: $50,000
- Average APY per agent: 50% (conservative)
- Total TVL: $2.5M

Revenue:
- Trading fees (10% of $1.25M profits): $125,000
- Marketplace volume (5% of TVL trades): $50,000
- Breeding fees: $30,000
- Premium features: $20,000
- ─────────────────────────────────────
- Total Year 1: $225,000

Year 2 Projection:
- 200 agents, $20M TVL
- Avg APY: 50%
- Platform revenue: $2M+
```

---

## 🔄 Trading Decision Pipeline

```
Market Data
├─ Price feeds (CoinGecko, Uniswap)
├─ On-chain liquidity
└─ Agent portfolio state

        ↓

StrategyAgent Analysis (Stage 1)
├─ Analyzes market trends
├─ Identifies opportunities
└─ Decision: "Sell 10 ETH, Buy 25,000 USDC"

        ↓

ResearcherAgent Validation (Stage 2)
├─ Checks historical accuracy (73% for this pattern)
├─ Verifies liquidity sufficient
└─ Confirms market data freshness

        ↓

RiskAgent Approval (Stage 3)
├─ Max loss if wrong: 5% (acceptable for aggressive risk tolerance)
├─ Slippage: 0.5% (within limits)
└─ Final approval: YES

        ↓

ExecutorAgent Encoding (Stage 4)
├─ Encodes: trade amount, direction, slippage
├─ Timestamp: T+2 seconds
└─ Sends to 0G Compute

        ↓

0G Compute Verification (TEE)
├─ Verifies trade logic: SOUND
├─ Returns proof hash: 0x7f3e...a4d2
├─ Confidence score: 87%
└─ Records on-chain

        ↓

Blockchain Execution
├─ Swap executed on Uniswap
├─ Profit verified: $2,500 ✓
├─ Recorded in ProofOfTrade.sol
└─ Dividends distributed

        ↓

Revenue Distribution
├─ iNFT holders: $1,750
├─ Breeding fund: $500
└─ Platform: $250
```

---

## 🧬 Breeding & Evolution Mechanics

### Eligibility
```
Both agents must have:
- Accuracy ≥ 75%
- Active iNFT status
- Zero breeding cooldown
```

### Offspring Calculation
```
Parent A: accuracy=92%, gen=3, risk tolerance=7
Parent B: accuracy=84%, gen=1, risk tolerance=8

Child:
- Accuracy: (92 + 84) / 2 = 88%
- Generation: max(3, 1) + 1 = 4 (Gen 4!)
- Risk Tolerance: (7 + 8) / 2 ± 1 = 8 (improved!)
- Other traits: similar blending
```

### Parent Royalties
```
Child lifetime revenue: $100,000
Parent A: 2.5% × $100,000 = $2,500
Parent B: 2.5% × $100,000 = $2,500
```

### Evolution Over Generations
```
Gen 0 (Original agents):     avg 80% accuracy
Gen 1 (First children):      avg 83% accuracy ↑3%
Gen 2 (Second generation):   avg 85% accuracy ↑2%
Gen 3 (Third generation):    avg 87% accuracy ↑2%

Result: Natural selection drives continuous improvement!
```

---

## 🔐 Security & Verification

### Trade Verification
1. **Proof-of-Intelligence**: Agent commits decision before execution
2. **0G Compute TEE**: Decision verified in Trusted Execution Environment
3. **SHA-256 Proof**: Immutable cryptographic record on-chain
4. **Confidence Scoring**: Only trades ≥70% confidence execute
5. **Profit Validation**: Actual profit vs expected ±10% tolerance

### Holder Protection
1. **Dividend Transparency**: All trade profits logged to 0G Log storage
2. **Audit Trail**: Complete history of every decision, trade, breeding
3. **Price Floor**: iNFT priced at minimum based on traits
4. **Liquidity**: Marketplace ensures agents can be sold at fair price

---

## 📈 Key Metrics for Success

### Agent Level
- Accuracy rate (% profitable trades)
- Win rate (# winning vs total trades)
- Average trade profit
- Max drawdown (peak-to-trough loss)
- Sharpe ratio (risk-adjusted returns)
- APY (annual percentage yield)

### Portfolio Level
- Total Value Locked (TVL) across holdings
- Monthly dividend income
- Average APY across portfolio
- Unrealized gains (market price appreciation)
- Concentration risk (% in top performer)

### Platform Level
- Total agents created
- Total TVL (sum of all agent capital)
- Monthly revenue generated
- Average agent APY
- Marketplace volume
- Number of iNFT holders
- Breeding events (ecosystem health)

---

## 🚀 Deployment Checklist

- [x] 5 Smart contracts deployed to 0G Galileo
- [x] Backend API running (Express + WebSocket)
- [x] 0G Storage KV + Log configured
- [x] 0G Compute Router API integrated
- [x] Frontend deployed to Vercel
- [x] Dark theme UI implemented
- [x] Portfolio management system
- [x] Agent economics tracker
- [ ] Mainnet contracts (pending)
- [ ] Production 0G deployment (pending)

---

## 📊 API Reference

### Portfolio Endpoints
```
GET  /api/portfolio/{userId}              - Get portfolio summary
POST /api/portfolio/{userId}/buy           - Buy agent iNFT
POST /api/portfolio/{userId}/sell          - Sell agent iNFT
GET  /api/portfolio/{userId}/top-holdings  - Get top performers
```

### Agent Endpoints
```
GET  /api/agent/{agentId}/metrics          - Agent performance data
GET  /api/agent/{agentId}/trades           - Trade history
POST /api/agent/{agentId}/trade            - Record new trade
GET  /api/agent/{agentId}/breeding         - Breeding history
POST /api/agent/breed                      - Record breeding event
```

### Platform Endpoints
```
GET  /api/platform/economics               - Platform economics
GET  /api/platform/leaderboard             - Top agents by APY
GET  /api/platform/volume                  - Marketplace volume
GET  /api/platform/stats                   - Comprehensive statistics
```

---

## 🔗 Contract Addresses (0G Galileo Testnet)

| Contract | Address | Status |
|----------|---------|--------|
| AgentCapital | `0x...` | Deployed |
| AgentNFT | `0x...` | Deployed |
| AgentMarketplace | `0x...` | Deployed |
| AgentBreeding | `0x...` | Deployed |
| ProofOfTrade | `0x...` | Deployed |

---

<div align="center">

**AGENT CAPITAL** — Where Autonomous AI Agents Become Tradeable, Yielding Assets

Powered by [0G Network](https://0g.ai) • Built on Vercel • Production Ready

</div>
