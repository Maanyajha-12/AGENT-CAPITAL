
  "verified": true,
  "confidence": 91,
  "proof": "0x7a3f8b2c1d4e5f6a...",
  "computeHash": "0g_router_tee_8f7a6b5c4d3e2f1a",
  "verificationSource": "0g-compute",
  "teeVerified": true,
  "providerAddress": "0g-router",
  "feasibility_verified": 89,
  "safety_verified": 93,
  "legality_verified": 96,
  "cost_verified": 84,
  "overall_verification": 91
}
```

The `proof` field is a **SHA-256 hash** of the full deliberation payload — creating a tamper-evident, verifiable record of the AI decision.

---

## 🌐 Network Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  0G GALILEO TESTNET                                         │
│                                                             │
│  Chain ID:      16602                                       │
│  RPC:           https://evmrpc-testnet.0g.ai                │
│  Explorer:      https://chainscan-galileo.0g.ai             │
│  Faucet:        https://faucet.0g.ai                        │
│  Currency:      0G (18 decimals)                            │
│                                                             │
│  0G COMPUTE ROUTER API                                      │
│  Endpoint:      https://router-api-testnet                  │
│                 .integratenetwork.work/v1                    │
│  Dashboard:     https://pc.testnet.0g.ai                    │
│                                                             │
│  0G STORAGE                                                 │
│  KV Store:      Local node (in-memory fallback)             │
│  Log Store:     Local node (in-memory fallback)             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 0G Infrastructure Usage Map

```
                        ┌──────────────────────┐
                        │    SWARM OS Frontend  │
                        │   (Vercel Deploy)     │
                        └──────────┬───────────┘
                                   │
                        ┌──────────┴───────────┐
                        │   Express Backend     │
                        │   (WebSocket + REST)  │
                        └──┬────────┬────────┬─┘
                           │        │        │
              ┌────────────┘        │        └────────────┐
              ▼                     ▼                     ▼
    ┌─────────────────┐   ┌─────────────────┐   ┌────────────────┐
    │  0G Compute     │   │  0G Storage     │   │  0G Galileo    │
    │  Router API     │   │  KV + Log       │   │  Testnet       │
    │  ─────────────  │   │  ─────────────  │   │  ────────────  │
    │  TEE Inference  │   │  State + Audit  │   │  5 Contracts   │
    │  Proof Hashes   │   │  Append-only    │   │  On-chain      │
    │  4 AI Models    │   │  In-mem backup  │   │  Proofs        │
    └─────────────────┘   └─────────────────┘   └────────────────┘
```

---

## ✅ Verification Steps (For Judges)

### 1. View Live App
Visit [https://frontend-six-steel-45.vercel.app](https://frontend-six-steel-45.vercel.app)

### 2. Verify Contracts On-Chain
Click any contract address in the table above — all 5 link directly to the 0G Galileo block explorer.

### 3. Check Transaction Hashes
Click any tx hash in the table above — each shows ✅ `Success` status at block `30,912,464`.

### 4. Run a Deliberation
1. Open the live app → click **"Try Live Demo"**
2. Type any prompt → click **"Start Deliberation"**
3. Watch 5 agents work through the pipeline in real-time
4. View the **SHA-256 proof hash** and **verification badge** when complete

### 5. Verify 0G Compute
The Verification Badge component displays:
- `0G Router API (TEE)` — the verification source
- `0G Galileo Testnet (ID: 16602)` — the chain
- Cryptographic proof hash with copy button
- 4-dimension verification scores (Feasibility, Safety, Legality, Cost)

### 6. Explore All Features
The app has **8 tabs**, all functional:
- **Overview**: Business narrative with market data
- **Deliberate**: Live multi-agent AI pipeline
- **Agents**: Real-time agent performance metrics
- **Gallery**: Agent iNFTs with 6 genetic traits
- **Arena**: Competitive elimination tournaments
- **Cross-Chain**: Multi-chain agent coordination
- **History**: Past deliberation sessions
- **Statistics**: System-wide analytics

---

## 🏆 Technical Highlights for Judges

| Category | Detail |
|----------|--------|
| **Novel Mechanism** | Proof-of-Intelligence (commit-reveal consensus for AI agents) |
| **0G Compute** | TEE-verified inference via Router API with SHA-256 proof hashes |
| **0G Storage** | KV + Log with in-memory fallback for resilience |
| **Smart Contracts** | 5 deployed to 0G Galileo — all verifiable on-chain |
| **Cross-Chain** | Bridge supports Ethereum Sepolia, Polygon Mumbai, and 0G |
| **Evolution** | Genetic crossover breeding with ±5 mutation per trait |
| **API Surface** | 25+ REST endpoints + WebSocket real-time events |
| **Frontend** | 8 tabs, Framer Motion animations, responsive dark theme |
| **Demo Mode** | Full offline simulation — works without backend on Vercel |

---

<div align="center">

*All proofs are independently verifiable on [chainscan-galileo.0g.ai](https://chainscan-galileo.0g.ai)*

Powered by [0G Network](https://0g.ai) · Built for ETHGlobal

</div>
