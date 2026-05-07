# 🚀 AGENT CAPITAL - Implementation Guide

## Phase 1: Local Development Setup

### Prerequisites
- Node.js 18+
- Foundry (for smart contract development)
- Git

### Step 1: Clone & Install Dependencies

```bash
# Frontend
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000

# Backend
cd ../backend
npm install
npm run dev
# Runs on http://localhost:5000

# Contracts
cd ../contracts
forge build
```

### Step 2: Environment Configuration

Create `.env` files:

**backend/.env**
```bash
# Server
PORT=5000
NODE_ENV=development

# 0G Storage
OG_KV_ENDPOINT=http://localhost:8080
OG_LOG_ENDPOINT=http://localhost:8081

# 0G Compute
OG_COMPUTE_ENDPOINT=http://localhost:8000
OG_COMPUTE_API_KEY=test-key

# RPC & Chain
0G_RPC_URL=https://evmrpc-testnet.0g.ai
0G_NETWORK_ID=16602

# Feature Flags
DEMO_MODE=true
USE_MOCK_DATA=true
```

**frontend/.env**
```bash
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_DEMO_MODE=true
```

### Step 3: Database Setup (Optional - Using 0G Storage)

The system uses 0G Storage for persistence. No additional database needed!

---

## Phase 2: Smart Contract Deployment

### 1. Compile Contracts
```bash
cd contracts
forge build

# Output
# Compiled 5 contracts successfully
# Total size: 2.4 MB
```

### 2. Deploy to 0G Testnet

**Set private key:**
```bash
export PRIVATE_KEY=your_private_key_here
export 0G_RPC_URL=https://evmrpc-testnet.0g.ai
```

**Deploy (using existing Deploy.sol)**:
```bash
forge script script/Deploy.sol:DeployScript \
  --rpc-url $0G_RPC_URL \
  --broadcast \
  --private-key $PRIVATE_KEY
```

**Save contract addresses:**
```bash
# Update backend/src/config/contracts.json with deployed addresses
# Update frontend/.env with contract addresses
```

### 3. Verify on Block Explorer

Go to [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai) and verify:
- [ ] AgentCapital.sol deployed
- [ ] AgentNFT.sol deployed
- [ ] AgentMarketplace.sol deployed
- [ ] AgentBreeding.sol deployed
- [ ] ProofOfTrade.sol deployed

---

## Phase 3: Backend Configuration

### 1. Initialize 0G Storage

```typescript
// backend/src/og-storage.ts
const storage = new OGStorage(
    process.env.OG_KV_ENDPOINT,
    process.env.OG_COMPUTE_ENDPOINT
);

await storage.initialize();
// Connects to KV store and Log store
```

### 2. Initialize Services

```typescript
// backend/src/index.ts
import { PortfolioManager } from './portfolio';
import { AgentEconomicsTracker } from './agent-economics';

const portfolioManager = new PortfolioManager(storage);
const economicsTracker = new AgentEconomicsTracker(storage);

// Mount API routes
app.use('/api', createAgentCapitalRoutes(
    portfolioManager,
    economicsTracker,
    storage
));
```

### 3. WebSocket for Real-Time Updates

```typescript
wss.on('connection', (ws) => {
    // Send initial state
    ws.send(JSON.stringify({
        type: 'connection',
        status: 'connected',
        timestamp: Date.now()
    }));

    // Listen for updates
    ws.on('message', async (data) => {
        const message = JSON.parse(data);
        // Process message
        // Broadcast updates to all clients
    });
});
```

---

## Phase 4: Frontend Setup

### 1. Dark Theme Enablement

```typescript
// frontend/src/main.tsx
import './styles/dark-theme.css'
import App from './App'

// CSS variables automatically applied
```

### 2. Component Structure

```
src/components/
├─ PortfolioPanel.tsx       (NEW) - Holdings & dividends
├─ MarketplacePanel.tsx     (NEW) - Browse & buy agents
├─ StrategyPanel.tsx        (NEW) - Monitor strategy execution
├─ DeliberationPanel.tsx    - Trading decisions
├─ AgentMonitor.tsx         - Agent metrics
├─ Gallery.tsx              - Genetic traits
└─ ...
```

### 3. API Integration

```typescript
// frontend/src/services/api.ts
const api = {
    // Portfolio
    getPortfolio: async (userId) => 
        fetch(`/api/portfolio/${userId}`).then(r => r.json()),
    
    buyAgent: async (userId, agentId, quantity, price) =>
        fetch(`/api/portfolio/${userId}/buy`, {
            method: 'POST',
            body: JSON.stringify({ agentId, quantity, price })
        }).then(r => r.json()),
    
    // Agent
    getAgentMetrics: async (agentId) =>
        fetch(`/api/agent/${agentId}/metrics`).then(r => r.json()),
    
    // Platform
    getPlatformStats: async () =>
        fetch(`/api/platform/stats`).then(r => r.json()),
};

export default api;
```

---

## Phase 5: 0G Integration

### 1. 0G Storage Configuration

**KV Store Setup:**
```typescript
// Store user data
const key = `portfolio:${userId}`;
const value = JSON.stringify(portfolio);
await storage.setKV(key, value);

// Retrieve
const data = await storage.getKV(key);
```

**Log Store Setup:**
```typescript
// Immutable audit trail
await storage.logEvent(
    `trade:${agentId}:${tradeId}`,
    JSON.stringify(trade),
    'trade_executed'
);
```

### 2. 0G Compute Integration

```typescript
// Call 0G Compute for trade verification
const verifier = getComputeVerifier();

const proof = await verifier.verify({
    agentId,
    decision: "Sell 10 ETH",
    amount: 10,
    slippage: 0.5,
});

const proofHash = proof.hash; // SHA-256
const confidence = proof.confidence; // 0-100
```

### 3. 0G Chain (Smart Contracts)

```solidity
// Record trade with 0G proof
function recordTrade(
    uint256 _agentId,
    string memory _action,
    uint256 _amount,
    uint256 _profit,
    string memory _proofHash  // From 0G Compute
) external {
    // Verify proof
    // Update state
    // Distribute dividends
}
```

---

## Phase 6: Testing & Validation

### 1. Unit Tests

```bash
# Backend tests
cd backend
npm test

# Expected: 150+ tests passing
```

### 2. Contract Tests

```bash
# Smart contract tests
cd contracts
forge test

# Expected: 100+ assertions passing
```

### 3. Integration Tests

```bash
# Full system test
npm run test:integration

# Verifies: frontend ↔ backend ↔ contracts ↔ 0G
```

### 4. Manual Testing Checklist

- [ ] User can create portfolio
- [ ] User can buy agent iNFT
- [ ] Trade records with 0G proof
- [ ] Dividends calculated correctly (70/20/10 split)
- [ ] Agents can breed (both 75%+ accuracy)
- [ ] Parent receives royalties
- [ ] Marketplace shows price history
- [ ] WebSocket updates in real-time
- [ ] Dark theme loads correctly
- [ ] Mobile responsive

---

## Phase 7: Production Deployment

### 1. Frontend Deployment (Vercel)

```bash
# Deploy to Vercel
npm install -g vercel

cd frontend
vercel
# Select project
# Confirm settings
# Deploy!
```

### 2. Backend Deployment (Heroku / Railway / Custom)

```bash
# Create Procfile
echo "web: npm run start:prod" > Procfile

# Deploy
git push heroku main
```

### 3. Smart Contracts (0G Mainnet)

```bash
# Update RPC to mainnet
export 0G_RPC_URL=https://evmrpc.0g.ai

# Deploy
forge script script/Deploy.sol:DeployScript \
  --rpc-url $0G_RPC_URL \
  --broadcast \
  --private-key $PRIVATE_KEY
```

### 4. Domain Setup

- Frontend: `agentcapital.com`
- API: `api.agentcapital.com`
- Docs: `docs.agentcapital.com`

---

## Phase 8: Post-Launch Operations

### Monitoring

- Backend health: `/api/health`
- Contract events: Listen to `TradeExecuted`, `AgentsBred`, etc.
- Storage usage: Monitor 0G KV/Log usage
- Platform metrics: Dashboard at `/api/platform/stats`

### Maintenance

```bash
# Weekly
- Check error logs
- Review trader performance
- Validate contracts

# Monthly
- Update documentation
- Review security
- Optimize queries
```

### Upgrades

```bash
# Contract upgrades
# 1. Deploy new implementation
# 2. Update proxy pointer (if using proxy pattern)
# 3. Test migration
# 4. Update frontend ABI

# Feature releases
# 1. Feature branch
# 2. PR review + tests
# 3. Merge to main
# 4. Auto-deploy via CI/CD
```

---

## 📊 Expected Metrics After Launch

### Week 1
- 10 agents created
- $500K TVL
- 100 trades executed
- 50 iNFT holders

### Month 1
- 50 agents
- $2.5M TVL
- 5,000 trades
- 500 iNFT holders

### Year 1
- 200 agents
- $20M TVL
- 500,000 trades
- 5,000 iNFT holders
- $2M+ platform revenue

---

## 🔗 Useful Links

- **0G Network**: https://0g.ai
- **Block Explorer**: https://chainscan-galileo.0g.ai
- **Documentation**: https://docs.0g.ai
- **GitHub**: https://github.com/your-org/agent-capital
- **Discord**: Your community server

---

## ❓ Troubleshooting

### Backend won't connect to 0G Storage
```bash
# Check endpoints
curl http://localhost:8080/health
curl http://localhost:8081/health

# Update .env if needed
```

### Contracts won't deploy
```bash
# Check gas
# Check RPC connection
# Check private key has 0G testnet funds
# Try smaller max gas price
```

### Frontend not updating
```bash
# Check backend connection
# Check WebSocket URL in .env
# Refresh browser (Cmd+Shift+R)
# Check browser console for errors
```

---

<div align="center">

**Ready to launch AGENT CAPITAL?** 🚀

Follow this guide step-by-step and you'll have the complete system running!

</div>
