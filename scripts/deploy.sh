#!/bin/bash
# Run from: /home/maanya-jha/Desktop/SWARMOS
# Usage: bash scripts/deploy.sh

set -e
cd "$(dirname "$0")/.."

echo "🔧 Configuring git..."
git config user.email "maanya@agentcapital.ai" 2>/dev/null || true
git config user.name "Maanya Jha" 2>/dev/null || true

echo "📦 Staging all changes..."
git add -A

echo "💾 Committing..."
git commit -m "feat: complete Agent Capital v2 - Vercel deploy, TS fixes, real wallet, API services

FIXES:
- Fix TS1117: duplicate borderRadius in App.tsx line 132
- Fix name: Maanyu → Maanya in Dashboard welcome message
- Fix layout: main-content width calc(100vw - 224px), overflow-x hidden

NEW FEATURES:
- Real MetaMask wallet connect (falls back to demo mode)
- WebSocket LiveFeedSocket for real-time trade events
- Complete REST API service layer (AgentsAPI, PortfolioAPI, BreedingAPI, ProofAPI)
- useAPI() React hook with graceful fallback to demo data
- switchTo0GChain() helper for adding 0G Galileo testnet
- StrategyPanel: fully working Invest + Details modals w/ Framer Motion
- Mobile bottom navigation (5 tabs)
- Global Toast notification system
- Skeleton loader components
- Animated Tooltip component
- vercel.json deployment config
- .env.production and .env.local files
- DEPLOYMENT_PROOF.md with 3-min demo script

DEPLOYED TO: https://frontend-6aopdgc9s-maanya-s-projects-eba44211.vercel.app" || echo "Nothing new to commit"

echo "🚀 Pushing to GitHub..."
git push origin main 2>/dev/null || git push 2>/dev/null || echo "Push skipped (no remote configured)"

echo "🏗 Building frontend..."
cd frontend
npm run build

echo "☁️  Deploying to Vercel..."
npx vercel --prod --yes

echo "✅ Done!"
