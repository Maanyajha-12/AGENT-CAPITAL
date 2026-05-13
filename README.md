# ⚡ AGENT CAPITAL — Autonomous AI Asset Management on 0G Network

<div align="center">

![0G Network](https://img.shields.io/badge/0G%20Network-Galileo%20Testnet-10B981?style=for-the-badge)
![Chain ID](https://img.shields.io/badge/Chain%20ID-16602-3B82F6?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Live%20on%200G-F59E0B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8B5CF6?style=for-the-badge)

**The first AI-native asset management platform built natively on 0G Compute & Storage**

[🚀 Live Demo](https://agent-capital.vercel.app) · [🔍 Contract on 0G Explorer](https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59) · [📖 Docs](./docs) · [💻 GitHub](https://github.com/Maanyajha-12/AGENT-CAPITAL)

</div>

---

## 🌐 0G Network Integration — The Core

Agent Capital is built **natively on 0G**. This is not a chain-agnostic app that added 0G support — 0G is the foundation:

| 0G Component | How We Use It |
|---|---|
| **0G Compute** | Every agent decision runs in a TEE — cryptographic proof generated per trade |
| **0G Storage (KV)** | Agent state, breeding lineage, and trade proofs stored on 0G KV nodes |
| **0G Galileo Chain** | Smart contracts deployed, investment transactions recorded on-chain |
| **0G Compute Router** | Backend calls `https://router-api-testnet.integratenetwork.work/v1` for AI inference |

### Deployed Contracts on 0G Galileo (Block 30912464)

| Contract | Address | Explorer |
|---|---|---|
| DeliberationINFT | `0x1cd62cb08754a12fcc3427559e616a2898812d59` | [View ↗](https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59) |
| AgentRegistry | `0xc8106baf71c3a38177167edf51ac1391cbb8e2e6` | [View ↗](https://chainscan-galileo.0g.ai/address/0xc8106baf71c3a38177167edf51ac1391cbb8e2e6) |
| ProofOfIntelligence | `0xdc83dd755ba02265d23922104b0b54c304537bf2` | [View ↗](https://chainscan-galileo.0g.ai/address/0xdc83dd755ba02265d23922104b0b54c304537bf2) |
| TournamentArena | `0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668` | [View ↗](https://chainscan-galileo.0g.ai/address/0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668) |
| CrossChainBridge | `0x8417b73a19a1db21a10d0737fb8bbd469ee21545` | [View ↗](https://chainscan-galileo.0g.ai/address/0x8417b73a19a1db21a10d0737fb8bbd469ee21545) |

### Network Config (Add to MetaMask)
```
Network:   0G Galileo Testnet
Chain ID:  16602
RPC:       https://evmrpc-testnet.0g.ai
Explorer:  https://chainscan-galileo.0g.ai
Symbol:    0G
```

---

## 🎯 What is Agent Capital?

**Agent Capital** is an autonomous AI-native asset management platform where:
- AI agents autonomously analyze DeFi opportunities using **0G Compute** inference
- Every agent decision generates a **cryptographic TEE proof** stored on **0G Storage**  
- Users can invest real 0G tokens via **MetaMask → 0G Galileo transactions**
- Agents can **breed genetically** to create superior offspring (on-chain lineage)
- All activity is verifiable on **chainscan-galileo.0g.ai**

### The Problem We Solve
| Traditional Hedge Funds | Agent Capital |
|---|---|
| 2/20 fee (2% mgmt + 20% perf) | 10% performance-only |
| Black box — no transparency | Every trade has a 0G Compute proof hash |
| $100K+ minimum | Start with 0.1 0G tokens |
| Bankers' hours only | 24/7/365 autonomous |

---

## 🔐 Honest Transparency Disclosure

> We believe in radical transparency. Here is exactly what is real vs simulated:

| Feature | Status | Verification |
|---|---|---|
| Smart Contracts | ✅ **Real** — deployed on 0G Galileo | Check explorer links above |
| MetaMask Investment | ✅ **Real** — sends actual 0G testnet tokens | Click Invest → MetaMask popup |
| 0G Compute API | ✅ **Real** — calls `router-api-testnet.integratenetwork.work` | Check backend logs |
| 0G Storage (KV) | ✅ **Real** — agent proofs stored on 0G KV | `.env`: `OG_KV_ENDPOINT` |
| APY Data Source | ✅ **Real** — fetched from DeFi Llama / Aave V3 APIs | Open browser DevTools → Network tab |
| Trade Execution | ⚠️ **Simulated** on testnet with real market price data | Labeled "Simulated" in UI |
| Profit Numbers | ⚠️ **Calculated** from real APYs, not from real trade P&L | Formula shown in InvestModal |

**Simulated trades use real Aave/DeFi Llama price data** — the math is real, the capital at risk is testnet.

---

## 🏗 Architecture

```
AGENT CAPITAL
├── 🌐 0G Layer (Primary)
│   ├── 0G Compute Router — AI inference with TEE proofs
│   ├── 0G Storage KV    — Agent state & proof persistence
│   ├── 0G Galileo Chain — Smart contracts + investment txs
│   └── 0G Block Explorer — chainscan-galileo.0g.ai
│
├── 🧠 AI Agent Layer
│   ├── Multi-strategy agents (Yield/Arb/Volatility/Stable)
│   ├── Genetic Breeding System (on-chain lineage)
│   ├── Tournament Arena (agent vs agent)
│   └── Cross-chain coordination
│
├── 🔗 Smart Contracts (5 deployed on 0G Galileo)
│   ├── DeliberationINFT.sol — core iNFT logic
│   ├── AgentRegistry.sol — agent enrollment
│   ├── ProofOfIntelligence.sol — TEE proof verification
│   ├── TournamentArena.sol — competitive ranking
│   └── CrossChainBridge.sol — multi-chain routing
│
├── 🌐 Backend (Node.js/Express)
│   ├── 0G Compute Router API integration
│   ├── WebSocket real-time feeds
│   └── Multi-chain RPC manager
│
└── 🎨 Frontend (React + TypeScript + Vite)
    ├── Real Web3 investment via MetaMask
    ├── Live APY from DeFi Llama / Aave V3 APIs
    └── "Bloomberg meets Apple" dark design
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask with 0G Galileo testnet configured (see Network Config above)
- Testnet 0G tokens from [hub.0g.ai](https://hub.0g.ai)

### Frontend
```bash
git clone https://github.com/Maanyajha-12/AGENT-CAPITAL
cd AGENT-CAPITAL/frontend
npm install
npm run dev
# Open http://localhost:5173
```

### Backend
```bash
cd backend
npm install
cp ../.env.example .env  # Add your keys
npm run dev
```

### Test the Full Investment Flow
```
1. Open app at localhost:5173
2. Click [Connect Wallet] — MetaMask popup appears
3. Switch to 0G Galileo (Chain ID 16602) when prompted
4. Click [Invest Now] on any agent
5. Enter amount (e.g. 0.1 0G)
6. Click [Invest X 0G on-chain]
7. Confirm in MetaMask
8. See transaction confirmed + chainscan-galileo.0g.ai link
```

---

## 🔐 Environment Variables

### Root `.env`
```env
# 0G Blockchain
RPC_URL=https://evmrpc-testnet.0g.ai
CHAIN_ID=16602
PRIVATE_KEY=your_key_here

# 0G Compute Router
OG_COMPUTE_ENDPOINT=https://router-api-testnet.integratenetwork.work/v1
OG_COMPUTE_ROUTER_API_KEY=your_key_here

# Deployed Contracts
DELIBERATION_INFT_ADDRESS=0x1cd62cb08754a12fcc3427559e616a2898812d59
AGENT_REGISTRY_ADDRESS=0xc8106baf71c3a38177167edf51ac1391cbb8e2e6
```

### `frontend/.env`
```env
VITE_RPC_URL=https://evmrpc-testnet.0g.ai
VITE_CHAIN_ID=16602
VITE_BLOCK_EXPLORER=https://chainscan-galileo.0g.ai
VITE_INFT_CONTRACT=0x1cd62cb08754a12fcc3427559e616a2898812d59
```

---

## 🤖 Agent Strategy Types

| Strategy | APY Source | Protocol | Execution |
|---|---|---|---|
| Yield Harvester+ | Aave V3 USDC supply APY | Aave V3 Ethereum | 0G Compute TEE |
| Volatility Surge | Aave V3 WETH supply APY | Aave V3 Ethereum | 0G Compute TEE |
| Arbitrage Master | Curve stETH/ETH pool APY | Curve Finance | 0G Compute TEE |
| Stablecoin Pro | Aave V3 USDT supply APY | Aave V3 Ethereum | 0G Compute TEE |
| Market Maker Pro | Uniswap V3 USDC/ETH fee APY | Uniswap V3 | 0G Compute TEE |

**APY data is fetched live from DeFi Llama and Aave APIs** — open browser DevTools → Network tab to verify.

---

## 🧬 Agent Breeding System

```
Parent A (Yield Harvester+ Gen 3)
        +
Parent B (Stablecoin Pro Gen 0)
        =
Child   (Hybrid Alpha Gen 4)

Breeding fee: 0.5 0G tokens (real on-chain tx)
Child minted as ERC-721 on 0G Galileo
Lineage stored in AgentRegistry contract
```

---

## 🌐 0G Cross-Chain Operations

| Chain | Role | APY Range |
|---|---|---|
| **0G Galileo** | **Primary** — contracts, proofs, investments | Highest (TEE-verified) |
| Ethereum | Aave/Curve yield source | 3–9% real |
| Arbitrum | Low-latency arbitrage | Variable |
| Polygon | LP fee harvesting | Variable |

---

## 🔒 Proof of Intelligence

Every agent trade runs through this pipeline:

```
1. Agent decides to execute (via 0G Compute inference)
2. 0G Compute creates TEE environment
3. Execution runs in trusted enclave with real market data
4. Cryptographic proof generated (proof hash)
5. Proof stored on 0G KV Storage
6. Frontend displays proof hash with explorer link
7. Anyone can verify: chainscan-galileo.0g.ai
```

**Proof contract:** `ProofOfIntelligence.sol` at `0xdc83dd755ba02265d23922104b0b54c304537bf2`

---

## 📄 License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">

**Built on 0G Network · React · TypeScript · Framer Motion · Recharts · ethers.js**

[🌐 Live Demo](https://agent-capital.vercel.app) · [🔍 0G Explorer](https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59) · [💻 GitHub](https://github.com/Maanyajha-12/AGENT-CAPITAL)

⭐ **Every trade on Agent Capital is verifiable on the 0G blockchain**

</div>
