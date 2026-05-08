# AGENT CAPITAL Frontend - Deployment Guide

## 🚀 Quick Deployment to Vercel

This guide walks you through deploying the AGENT CAPITAL frontend to Vercel in minutes.

### Prerequisites

- [Vercel Account](https://vercel.com) (free)
- Node.js 16+ installed
- Git installed (optional, for easy deployment)

### Option 1: Deploy via Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Authenticate with Vercel
```bash
vercel login
```
This will open a browser window to authenticate. Follow the prompts.

#### Step 3: Navigate to Frontend Directory
```bash
cd /home/maanya-jha/Desktop/SWARMOS/frontend
```

#### Step 4: Deploy to Production
```bash
vercel --prod
```

**What the CLI will ask:**
- ✅ Set up and deploy? → Select "YES"
- ✅ Link to existing project? → Select "NO" (creates new project)
- ✅ What's your project's name? → Enter `agent-capital-frontend`
- ✅ In which directory is your code? → Press Enter (default: .)
- ✅ Want to modify these settings before deploying? → Select "NO"

#### Step 5: Wait for Deployment
The CLI will show you the build progress. Once complete, you'll get your live URL!

**Your deployment will be available at:**
```
https://agent-capital-frontend.vercel.app
```

---

### Option 2: Deploy via GitHub (Alternative)

#### Step 1: Create GitHub Repository
```bash
cd /home/maanya-jha/Desktop/SWARMOS
git init
git add .
git commit -m "Initial commit: AGENT CAPITAL production release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/agent-capital.git
git push -u origin main
```

#### Step 2: Connect to Vercel
1. Visit [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Enter: `https://github.com/YOUR_USERNAME/agent-capital.git`
4. Select root directory: `/frontend`
5. Click "Deploy"

---

### Option 3: Deploy via Vercel Web Dashboard

#### Step 1: Visit Vercel Dashboard
Go to [vercel.com/dashboard](https://vercel.com/dashboard)

#### Step 2: Click "Add New"
Select "Project"

#### Step 3: Import from Git
Connect your GitHub account and select the `agent-capital` repository

#### Step 4: Configure Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Step 5: Add Environment Variables (if needed)
```
VITE_API_URL=https://api.agent-capital.io
VITE_WEBSOCKET_URL=wss://ws.agent-capital.io
```

#### Step 6: Click "Deploy"

---

## 📊 What's Included in This Deployment

### Backend Services (TypeScript)
✅ **Trading Executor** - Real DEX integration for trade execution
✅ **Agent Metrics** - Real-time performance tracking (Win rate, APY, Sharpe ratio, Drawdown)
✅ **Agent Ranking** - Multi-factor scoring system (25% win rate, 25% Sharpe, 25% consistency, 25% profitability)
✅ **Portfolio Analytics** - Risk assessment, allocation breakdown, projections, rebalancing recommendations

### Frontend Components
✅ **Dashboard** - Portfolio overview with real-time metrics and charts
✅ **Agent Card** - Premium agent display with performance metrics, risk indicators, and actions
✅ **Portfolio Dashboard** - Deep analytics with performance trends, allocation, holdings table, recommendations
✅ **Dark Theme Design System** - Production-level UI with dark navy backgrounds, blue accents, glassmorphism

### Design System
✅ **Tailwind CSS** - Extended dark theme configuration
✅ **Recharts Integration** - Beautiful data visualizations
✅ **Framer Motion** - Smooth animations and transitions
✅ **Global CSS** - Pre-built dark theme components and utilities

---

## 🔧 Customization After Deployment

### Update Company Name
Edit `/frontend/src/App.tsx` line 110:
```tsx
<h1 className="text-4xl font-bold...">"AGENT CAPITAL"</h1>
```

### Change Color Scheme
Edit `/frontend/tailwind.config.js` in the colors section:
```js
colors: {
  accent: {
    primary: '#3b82f6',      // Blue buttons
    secondary: '#10b981',    // Green success
    tertiary: '#f59e0b',     // Orange warning
    danger: '#ef4444',       // Red errors
  }
}
```

### Modify API Endpoints
Create `.env.local` in the frontend directory:
```
VITE_API_URL=https://your-api-domain.com
VITE_WEBSOCKET_URL=wss://your-ws-domain.com
```

---

## 📈 Performance Metrics

Current Build Stats:
- **CSS Size**: 40.76 kB (gzip: 6.81 kB)
- **JS Size**: 837.66 kB (gzip: 232.78 kB)
- **Total**: ~1.87 MB (gzip: ~240 kB)

**Optimization Recommendations**:
1. Enable Brotli compression (Vercel does this automatically)
2. Use lazy loading for images
3. Code split with dynamic imports
4. Enable CDN caching for assets

---

## 🔐 Security Considerations

### Environment Variables
Never commit secrets to Git. Use Vercel's Environment Variables panel:

1. Go to your Vercel project
2. Click "Settings" → "Environment Variables"
3. Add your secrets there
4. They'll be available at build time

### Example Secrets to Add
```
DATABASE_URL=postgresql://...
API_KEY=sk_live_...
PRIVATE_KEY=0x...
```

### Security Headers (Already Configured)
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Cache-Control` for static assets

---

## 🧪 Testing Before Deployment

### Local Development
```bash
cd frontend
npm run dev
```
Visit `http://localhost:5173`

### Production Build Test
```bash
npm run build
npm run preview
```
Visit the preview URL shown in your terminal

### Check for Errors
```bash
npm run lint
```

---

## 📱 Verifying Your Deployment

Once deployed, verify by checking:

1. **Homepage loads** - Visit your deployed URL
2. **Dashboard displays** - Navigate to "Overview" tab
3. **Charts render** - Verify all visualizations load
4. **API connectivity** - Check browser console for errors
5. **Performance** - Run Lighthouse audit in Chrome DevTools

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Charts Not Displaying
- Check browser console for JavaScript errors
- Verify Recharts is installed: `npm list recharts`
- Ensure data is being passed correctly to components

### Slow Performance
- Audit bundle size: `npm run build --report`
- Enable Vercel Analytics: Dashboard → "Analytics"
- Check for unused dependencies: `npm prune --production`

### Environment Variables Not Working
- Verify they're defined in Vercel Dashboard
- Rebuild after adding variables: `vercel --prod`
- Check they're prefixed with `VITE_` for frontend

---

## 📊 Monitoring & Analytics

### Enable Vercel Analytics
1. Go to Project Settings
2. Click "Analytics" 
3. Enable "Web Analytics"

### View Logs
```bash
vercel logs
```

### Monitor Performance
Vercel automatically provides:
- Deployment history
- Build times
- Function durations
- Edge location performance

---

## 🚀 Next Steps

1. **Set up custom domain** - Project Settings → Domains
2. **Configure CI/CD** - Connect GitHub branches for auto-deploy
3. **Set up monitoring** - Enable alerts for failed builds
4. **Add SSL certificate** - Vercel provides automatic HTTPS
5. **Configure redirects** - Edit vercel.json to customize routing

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev

---

## ✅ Deployment Checklist

- [ ] All dependencies installed (`npm install`)
- [ ] Build successful (`npm run build`)
- [ ] No console errors in production build
- [ ] Environment variables configured
- [ ] Connected to GitHub/Git repository
- [ ] Vercel project created
- [ ] Initial deployment successful
- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified
- [ ] Analytics enabled
- [ ] Monitoring configured

---

**Congratulations! Your AGENT CAPITAL frontend is now deployed to production! 🎉**
