# 🚀 AGENT CAPITAL - Quick Reference

## 🎯 Project Mission
**First tokenized intelligence marketplace where AI agents generate verified yield**

---

## 📋 Quick Facts

| Aspect | Details |
|--------|---------|
| **Project Name** | AGENT CAPITAL |
| **Tagline** | Autonomous AI Agents as Tradeable, Yielding Assets on 0G |
| **Network** | 0G Galileo Testnet (16602) |
| **Smart Contracts** | 5 production-ready contracts |
| **Frontend** | React + Dark Theme + Vercel |
| **Backend** | Express.js + WebSocket |
| **Storage** | 0G Network (KV + Log) |
| **Compute** | 0G Compute TEE Verification |
| **Status** | ✅ Ready for Testnet Deployment |

---

## 💰 Economic Model (TL;DR)

```
Trade Profit: $1,000
├─ 70% → Holders
├─ 20% → Breeding Fund
└─ 10% → Platform Fee
```

---

## 🏗️ 5 Smart Contracts

| Contract | Purpose | Key Functions |
|----------|---------|----------------|
| **AgentCapital.sol** | Core logic | createAgent(), recordTrade(), breedAgents() |
| **AgentNFT.sol** | iNFT tokens | 6 genetic traits, dynamic pricing |
| **AgentMarketplace.sol** | Trading | buy, sell, price history |
| **AgentBreeding.sol** | Evolution | breeding, parent royalties (2.5%) |
| **ProofOfTrade.sol** | Verification | 0G Compute integration, SHA-256 proofs |

---

## 🎮 User Workflows

### Investor
```
1. Open marketplace
2. Browse agents (sort by APY)
3. Buy high-performer iNFT
4. Hold for dividends
5. Sell when price appreciates
```

### Trader
```
1. Create new agent
2. Set strategy (Yield Optimizer, Arbitrage, etc.)
3. Agent analyzes + executes trades
4. Each trade verified via 0G Compute
5. Profits split: 70% holders, 20% breeding, 10% platform
```

### Breeder
```
1. Identify 2 high-accuracy agents (75%+)
2. Initiate breeding (0.5 0G fee)
3. Child created with blended traits
4. Child inherits random mutation
5. Parents earn 2.5% of child's lifetime revenue
```

---

## 📊 Trading Pipeline

```
Market Data → StrategyAgent → ResearcherAgent → RiskAgent 
    ↓                                                ↓
    0G Compute Verification ← ExecutorAgent ← Approved
    ↓
    On-Chain Execution (Uniswap)
    ↓
    Dividend Distribution
```

---

## 🔄 Agent Traits & Breeding

### 6 Genetic Traits
1. **Risk Tolerance** (1-10) - How aggressive
2. **Strategy Accuracy** (0-100) - Success rate
3. **Trend Detection** (0-100) - Pattern recognition
4. **Execution Speed** (0-100) - Trade latency
5. **Recovery Rate** (0-100) - Bounce back from losses
6. **Scalability** (0-100) - Handle larger capital

### Breeding Formula
```
Child Accuracy = (Parent A + Parent B) / 2 ± randomly(1%)
Child Generation = max(parent gens) + 1
Child Traits = Blended parents ± mutation
```

---

## 📈 Key Metrics

### Per Agent
- Accuracy % (traders profitable)
- Win Rate % (winning vs total trades)
- APY (annual yield)
- Max Drawdown (worst loss)

### Per Portfolio
- TVL (total capital invested)
- Monthly Earnings
- Dividend APY

### Per Platform
- Total TVL across all agents
- Total Monthly Revenue
- # of Agents / Holders
- Average Agent APY

---

## 🌐 API Endpoints

### Portfolio
```
GET    /api/portfolio/{userId}
POST   /api/portfolio/{userId}/buy
POST   /api/portfolio/{userId}/sell
GET    /api/portfolio/{userId}/top-holdings
```

### Agent
```
GET    /api/agent/{agentId}/metrics
GET    /api/agent/{agentId}/trades
POST   /api/agent/{agentId}/trade
GET    /api/agent/{agentId}/breeding
POST   /api/agent/breed
```

### Platform
```
GET    /api/platform/economics
GET    /api/platform/leaderboard
GET    /api/platform/volume
GET    /api/platform/stats
```

---

## 🎨 Dark Theme Colors

| Use | Color | Hex |
|-----|-------|-----|
| Background | Gray-950 | #0f0f23 |
| Card | Gray-900 | #1a1a2e |
| Accent (Primary) | Cyan | #00d9ff |
| Accent (Success) | Emerald | #00ff88 |
| Danger | Red-Custom | #ff4477 |
| Text (Primary) | Gray-100 | #f5f5f7 |

---

## 🚀 Deployment Checklist

- [ ] Deploy 5 contracts to 0G Galileo
- [ ] Configure backend .env
- [ ] Configure frontend .env
- [ ] Test portfolio management
- [ ] Test agent creation
- [ ] Test agent trading
- [ ] Test breeding
- [ ] Test marketplace
- [ ] Test 0G Compute verification
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to production
- [ ] Monitor logs & metrics
- [ ] Launch to users!

---

## 🔗 Important Addresses & URLs

```
Frontend:        http://localhost:3000 (dev)
                 https://agentcapital.vercel.app (prod)
                 
Backend API:     http://localhost:5000 (dev)
                 https://api.agentcapital.com (prod)

0G RPC (Testnet): https://evmrpc-testnet.0g.ai
Block Explorer:   https://chainscan-galileo.0g.ai
0G Network:       https://0g.ai
```

---

## 💻 Quick Dev Commands

```bash
# Frontend
cd frontend && npm run dev      # Start dev server
npm run build                   # Production build
npm test                        # Run tests

# Backend
cd backend && npm run dev       # Start dev server
npm run build                   # Compile TypeScript
npm test                        # Run tests

# Contracts
cd contracts && forge build     # Compile
forge test                      # Run tests
forge script script/Deploy.sol:DeployScript \
  --rpc-url $RPC --broadcast --private-key $KEY
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Contracts won't deploy | Check gas, RPC url, private key funds |
| Backend won't connect to 0G | Check 0G endpoints in .env |
| Frontend not updating | Check WebSocket URL, restart frontend |
| Agents not improving | Ensure trades are broadcasting dividends |
| Breeding fails | Check both agents have 75%+ accuracy |

---

## 📞 File References

- **Smart Contracts**: `/contracts/src/*.sol`
- **Backend Services**: `/backend/src/*.ts`
- **Frontend Components**: `/frontend/src/components/*.tsx`
- **Styles**: `/frontend/src/styles/dark-theme.css`
- **Documentation**: `/*.md`

---

## 🎯 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-05-08 | ✅ Initial release - Testnet ready |
| 2.0.0 | TBD | Mainnet deployment |

---

## 🎓 Learning Resources

- **SYSTEM_ARCHITECTURE.md** - Technical deep-dive
- **IMPLEMENTATION_GUIDE.md** - Step-by-step setup
- **Smart Contract Comments** - Self-documented code
- **README.md** - Project overview

---

<div align="center">

## Ready to Launch? 🚀

All systems go! Deploy to 0G Galileo Testnet and start building AGENT CAPITAL.

**Questions?** Check the docs or inspect the source code.

---

Made with ❤️ for autonomous intelligence

</div>
