#!/usr/bin/env bash

# AGENT CAPITAL - Quick Start Deployment
# =====================================
# This script provides instructions for deploying to Vercel

cat << 'EOF'

╔══════════════════════════════════════════════════════════════════════════════╗
║                     🚀 AGENT CAPITAL - PRODUCTION READY 🚀                  ║
║                                                                              ║
║         Your complete AI Agent Investment Platform is ready to deploy!      ║
╚══════════════════════════════════════════════════════════════════════════════╝

📊 PROJECT STATISTICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Backend Services Created (4):
   • Trading Executor - Real DEX integration
   • Agent Metrics - Advanced performance metrics
   • Agent Ranking - Multi-factor scoring system
   • Portfolio Analytics - Risk & projections

✅ Frontend Components Created (3):
   • Dashboard - Portfolio overview
   • AgentCard - Agent marketplace cards
   • PortfolioDashboard - Advanced analytics

✅ Design System:
   • Dark theme with 8 colors
   • Component library (cards, buttons, tables, badges)
   • 12 animation types
   • Production CSS (40.76 KB gzipped)

✅ Technology Stack:
   • React 18.2 + TypeScript
   • Tailwind CSS 3.3
   • Recharts 2.10
   • Framer Motion
   • Ethers.js 6.7

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 DEPLOY TO VERCEL IN 5 STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Install Vercel CLI
   $ npm install -g vercel

STEP 2: Authenticate with Vercel
   $ vercel login
   (Opens browser - sign in or create a free account)

STEP 3: Navigate to Frontend
   $ cd /home/maanya-jha/Desktop/SWARMOS/frontend

STEP 4: Deploy to Production
   $ vercel --prod

STEP 5: Wait for Deployment ⏳
   The CLI will show:
   - Build progress
   - Deployment status
   - Your live URL!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 CLI PROMPTS REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When the CLI asks:

"Set up and deploy?"
   → YES

"Link to existing project?"
   → NO (creates a new project)

"What's your project's name?"
   → agent-capital-frontend

"In which directory is your code?"
   → . (current directory)

"Want to modify these settings before deploying?"
   → NO

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ YOUR LIVE SITE WILL BE AT:
   https://agent-capital-frontend.vercel.app

OR with a custom domain:
   https://your-domain.com

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After deployment, check these files:

✓ FRONTEND_DEPLOYMENT_GUIDE.md
  Complete deployment guide with all options

✓ PRODUCTION_COMPLETE.md
  Full feature list and architecture

✓ docs/API_DOCUMENTATION.md
  API endpoint documentation

✓ README.md (root)
  Project overview

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔧 DEVELOPMENT LOCALLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test locally before deploying:

cd frontend
npm run dev
→ Visit http://localhost:5173

Test production build:
npm run build
npm run preview
→ Visit http://localhost:4173

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 KEY FEATURES IN YOUR DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dashboard Tab:
  • Portfolio summary (4 metrics)
  • Performance chart (daily tracking)
  • Allocation pie chart
  • Top agents leaderboard
  • Recent trades timeline

Portfolio Tab (COMPLETELY REDESIGNED):
  • Extended metrics dashboard
  • Portfolio volatility & drawdown gauges
  • Performance trend (3m/6m/1y)
  • Holdings table (sortable)
  • Smart recommendations
  • Returns distribution

Marketplace: (uses new Agent Card)
  • Star ratings
  • Win rate & APY metrics
  • Sparkline charts
  • Risk profile gauges
  • One-click invest/follow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎨 DARK THEME DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Colors:
  🔵 Blue (#3b82f6) - Primary buttons
  🟢 Green (#10b981) - Success
  🟡 Amber (#f59e0b) - Warnings
  🔴 Red (#ef4444) - Errors

Backgrounds:
  ⚫ Navy (#0f172a) - Main
  ⚫ Charcoal (#1a1f3a) - Cards
  ⚫ Slate (#252d47) - Hover

Effects:
  ✨ Glassmorphism (frosted glass cards)
  ✨ Smooth animations (200ms transitions)
  ✨ Hover elevations (shadow & scale)
  ✨ Real-time glow effects

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 METRICS YOUR AGENTS TRACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Per Agent:
  • Win Rate (% profitable trades)
  • APY (annualized yield)
  • Sharpe Ratio (risk-adjusted return)
  • Max Drawdown (largest loss)
  • Accuracy (confidence score)
  • Trade Count
  • Performance Sparkline

Portfolio Wide:
  • Total Invested
  • Current Value
  • Total Profit/ROI
  • Portfolio Volatility
  • Correlation Risk
  • Allocation Breakdown
  • Projected Returns
  • Risk Distribution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❓ TROUBLESHOOTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issue: "Command not found: vercel"
   → npm install -g vercel

Issue: Build takes too long
   → First build after fresh install? Check npm audit fix

Issue: Charts not showing
   → Check browser console → verify Recharts installed

Issue: Need to add API endpoints
   → Create .env.local with VITE_API_URL=...

More help → See FRONTEND_DEPLOYMENT_GUIDE.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 YOU'RE ALL SET!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your AGENT CAPITAL platform is:
  ✅ Production-ready
  ✅ Built & optimized
  ✅ Fully documented
  ✅ Ready to deploy
  ✅ Designed professionally

Next: Run "vercel --prod" from /frontend and go live! 🚀

Questions? Check the documentation files or browser console for details.

╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  Built with ❤️ for the AI Agent Economy                                    ║
║  AGENT CAPITAL - Tokenized Intelligence Marketplace                        ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝

EOF
