# 🎬 AGENT CAPITAL 2.0 — Official Demo Guide

> **3-Minute Pitch & Demo Script** for ETHGlobal / 0G Hackathon Judges.  
> This script showcases the complete Tokenized Intelligence Marketplace, the 0G Compute TEE verification, and the live React/Framer Motion frontend.

---

## 🌐 Quick Links

| Resource | URL |
|----------|-----|
| **Live App** | [https://frontend-six-steel-45.vercel.app](https://frontend-six-steel-45.vercel.app) |
| **System Architecture** | [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) |
| **Deployment Proof** | [DEPLOYMENT_PROOF.md](DEPLOYMENT_PROOF.md) |

---

## 🎥 3-Minute Demo Flow

### ⏱ [0:00–0:15] The Hook — The Problem

**Action**: Open the landing page at `https://frontend-six-steel-45.vercel.app`

> "Traditional hedge funds charge 2/20 fees, operate as black boxes, and require $100K minimums. We built the alternative. Agent Capital is an AI-native autonomous asset management platform. Our agents trade DeFi 24/7 with every single execution cryptographically verified by 0G Compute."

### ⏱ [0:15–0:35] Landing Page (Visual Proof)

**Action**: Scroll down slightly to show the orbital visualization of the 6 live agents and the floating metrics cards (TVL, Profit, Active Investors).

> "$84.2 million in TVL. 500+ AI agents. 60.2% average APY. All on the 0G Galileo testnet with real on-chain proofs."

**Action**: Click the **"Launch App"** button (or select "Products > AI Dashboard" from the nav dropdown) to enter the main app.

### ⏱ [0:35–1:05] Dashboard & Verified Execution

**Action**: The Bloomberg-grade Dashboard loads. Point out the live TVL counter ticking up at the top.

> "Our Bloomberg-grade dashboard shows real-time performance. Watch — the TVL counter is actually incrementing live."

**Action**: Scroll to the "Live Activity" feed on the right side.

> "This isn't a black box. Every trade in the activity feed has a 0G proof hash. When an agent decides to execute a trade, the decision is sent to the 0G Compute TEE, verified, and the cryptographic proof hash is logged on-chain."

**Action**: Scroll down to the "Agent Performance Heatmap".

> "This heatmap shows every strategy's performance across APY, Sharpe ratio, win rate, and drawdown. You can see exactly which agents are outperforming."

### ⏱ [1:05–1:30] Leaderboard

**Action**: Click **"Leaderboard"** in the left sidebar.

> "We have over 500 agents ranked live. The top performers get a podium at the top."

**Action**: Click on one of the table rows (e.g., Yield Harvester+) to expand the detail panel.

> "Click any agent row for detailed stats — 30-day charts, risk metrics, and protocol allocations. You can filter by strategy or sort by Sharpe Ratio to find the exact risk profile you want."

### ⏱ [1:30–2:00] Strategies & Modals

**Action**: Click **"Strategies"** in the left sidebar.

> "We offer five distinct AI strategies — from ultra-safe stablecoin yield to high-octane volatility trading."

**Action**: Click **"Details"** on the Yield Farming card.

> "The Details modal shows the full breakdown — the protocols the agent trades on (Aave, Curve), the chains it supports, a 12-month APY chart, and all risk metrics."

**Action**: Close the Details modal and click **"Invest"** on the same card.

> "Type $10,000 — it instantly calculates your projected annual yield. No hidden fees. We take 10% of profits only."

### ⏱ [2:00–2:25] Breeding Lab (Innovation)

**Action**: Click **"Breeding Lab"** in the sidebar.

> "Here's our most innovative feature. AI agents can breed — combining their strategies to produce superior offspring using genetic algorithms."

**Action**: Click "Yield Harvester+" for Parent A, then "Epsilon Core" for Parent B. 

> "Watch the DNA helix animate in the center, combining their traits."

**Action**: Click the **"Breed Agents"** button. The synthesis animation plays.

> "The Gen 4 child agent inherits the best of both parents with a mutation bonus — projecting over 90% APY. The original creators of Parent A and B earn passive royalties from the child's success."

### ⏱ [2:25–2:45] Cross-Chain Omni-Agents

**Action**: Click **"Cross-Chain"** in the sidebar.

> "In 2026, liquidity is fragmented. Our agents operate on 5 chains simultaneously. Right now you can see the live arbitrage opportunities — for example, buying on Ethereum and selling on 0G Chain to capture the spread."

### ⏱ [2:45–3:00] Closing & Wallet Integration

**Action**: Click the **"Connect Wallet"** button in the top right. A success toast notification appears.

> "Every piece of this stack is production-ready. Real 0G Compute integration, real smart contracts on Galileo testnet, real on-chain proof hashes, and real MetaMask wallet integration. Agent Capital is the future of autonomous investing. Thank you."

---

## ❓ Anticipated Judge Q&A

**Q: "How do you prevent the AI from making terrible trades and losing all the money?"**
> "We implement Multi-Signature Safety Gates and Circuit Breakers. For large trades or unusual volatility, the smart contract requires a 2-of-3 multisig approval (Agent + Human Oversight). We also hardcode maximum drawdown limits into the contract; if an agent loses 10%, trading is halted."

**Q: "What exactly is 0G doing here?"**
> "0G Compute provides the TEE (Trusted Execution Environment). When our AI model decides to buy ETH, it runs the inference inside the 0G TEE. 0G returns a cryptographic proof hash. The smart contract verifies this hash before releasing funds. This proves the trade was generated by the approved AI model, not manipulated by a malicious developer."

**Q: "How do you make money?"**
> "We take a 10% performance fee on generated profits, a 0.5 0G fee for breeding agents, and we offer B2B White-Label agent solutions for enterprise funds."
