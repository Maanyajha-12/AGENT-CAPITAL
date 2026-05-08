import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3, Zap, Dna, Swords, Wifi, WifiOff, Globe,
  Briefcase, Store, TrendingUp, Trophy, Shield, Flame,
  ArrowUpRight, ArrowDownRight, ChevronRight
} from 'lucide-react'
import LandingPage from './components/LandingPage'
import DeliberationPanel from './components/DeliberationPanel'
import Gallery from './components/Gallery'
import ArenaPanel from './components/ArenaPanel'
import CrossChainDashboard from './components/CrossChainDashboard'
import MarketplacePanel from './components/MarketplacePanel'
import StrategyPanel from './components/StrategyPanel'
import Dashboard from './components/Dashboard'
import PortfolioDashboard from './components/PortfolioDashboard'
import Leaderboard from './components/Leaderboard'
import SystemStats from './components/SystemStats'
import WebSocketManager from './services/websocket'

type TabId = 'overview' | 'portfolio' | 'leaders' | 'marketplace' | 'strategy' | 'deliberate' | 'gallery' | 'arena' | 'crosschain' | 'analytics'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  exit:    { opacity: 0, y: -6,  transition: { duration: 0.15 } },
}

// Live ticker items
const TICKER_ITEMS = [
  { text: '🔥 Yield Harvester+ up +4.2% in last hour', positive: true },
  { text: '⚡ Arbitrage Master executed $12,400 trade', positive: true },
  { text: '💎 Stablecoin Pro hit 89.1% win rate', positive: true },
  { text: '🚀 New agent "Omega Fund" deployed · Gen 3', positive: true },
  { text: '📈 Platform TVL crossed $84M total', positive: true },
  { text: '✅ 0G Compute verified 247 trades in last hour', positive: true },
  { text: '🏆 Volatility Surge ranked #1 this week', positive: true },
  { text: '💰 $2.3M profit distributed to investors today', positive: true },
  { text: '🤖 Epsilon Core breeding cooldown complete', positive: true },
  { text: '📊 Market Maker generated $8,420 in LP fees', positive: true },
]

function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #3d1a00, #7f1d1d)',
        borderBottom: '1px solid #5a1a00',
        overflow: 'hidden',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="ticker-track"
        style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', alignItems: 'center' }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: '0.72rem', fontWeight: 500, color: 'rgba(255,254,249,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            {item.text}
            <span style={{ color: 'rgba(255,254,249,0.3)' }}>•</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [wsConnected, setWsConnected] = useState(false)
  const [systemHealth, setSystemHealth] = useState('checking')
  const [showFOMO, setShowFOMO] = useState(true)
  const [liveStat, setLiveStat] = useState({ investors: 12453, profit: 84.2 })

  useEffect(() => {
    const ws = WebSocketManager.getInstance()
    ws.connect()
    ws.onConnected(() => setWsConnected(true))
    ws.onDisconnected(() => setWsConnected(false))
    return () => { ws.disconnect() }
  }, [])

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || ''
        const response = await fetch(`${apiUrl}/api/health`)
        setSystemHealth(response.ok ? 'healthy' : 'unhealthy')
      } catch {
        setSystemHealth('disconnected')
      }
    }
    checkHealth()
    const interval = setInterval(checkHealth, 10000)
    return () => clearInterval(interval)
  }, [])

  // Simulate live stat updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStat(s => ({
        investors: s.investors + Math.floor(Math.random() * 3),
        profit: parseFloat((s.profit + Math.random() * 0.01).toFixed(1)),
      }))
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigate = (tab: string) => setActiveTab(tab as TabId)

  const tabs: { id: TabId; label: string; icon: any; badge?: string }[] = [
    { id: 'overview',    label: 'Overview',     icon: TrendingUp },
    { id: 'portfolio',   label: 'Portfolio',    icon: Briefcase },
    { id: 'leaders',     label: 'Leaderboard',  icon: Trophy,  badge: 'LIVE' },
    { id: 'marketplace', label: 'Marketplace',  icon: Store,   badge: '500+' },
    { id: 'strategy',    label: 'Strategies',   icon: BarChart3 },
    { id: 'gallery',     label: 'Breeding',     icon: Dna },
    { id: 'arena',       label: 'Reputation',   icon: Shield },
    { id: 'crosschain',  label: 'Cross-Chain',  icon: Globe },
    { id: 'deliberate',  label: 'Deliberate',   icon: Zap },
    { id: 'analytics',   label: 'Analytics',    icon: BarChart3 },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':    return <Dashboard />
      case 'portfolio':   return <PortfolioDashboard />
      case 'leaders':     return <Leaderboard />
      case 'marketplace': return <MarketplacePanel />
      case 'strategy':    return <StrategyPanel />
      case 'gallery':     return <Gallery />
      case 'arena':       return <ArenaPanel />
      case 'crosschain':  return <CrossChainDashboard />
      case 'deliberate':  return <DeliberationPanel />
      case 'analytics':   return <SystemStats />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* ── Live Ticker ── */}
      <LiveTicker />

      {/* ── Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-default)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 1px 8px rgba(90,30,0,0.08)',
        }}
      >
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
            {/* Logo */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
              onClick={() => setActiveTab('overview')}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '36px', height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7f1d1d, #b91c1c)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(127,29,29,0.35)',
                }}
              >
                <TrendingUp size={18} color="#fff" />
              </motion.div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
                  AGENT <span className="gradient-text">CAPITAL</span>
                </div>
                <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  AI Asset Management
                </div>
              </div>
            </div>

            {/* Header right */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Platform stats */}
              <div className="hide-mobile" style={{
                display: 'flex', alignItems: 'center', gap: '1.25rem',
                padding: '0.4rem 1rem',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-default)',
                fontSize: '0.72rem',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--accent-maroon)' }}>${liveStat.profit}M</span> profit
                </span>
                <span style={{ color: 'var(--border-default)' }}>|</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{liveStat.investors.toLocaleString()}</span> investors
                </span>
              </div>

              {/* Connection status */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.375rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem', fontWeight: 600,
                  background: wsConnected ? 'var(--green-light)' : 'var(--maroon-light)',
                  border: `1px solid ${wsConnected ? '#bbf7d0' : 'var(--border-maroon)'}`,
                  color: wsConnected ? 'var(--accent-green)' : 'var(--accent-maroon)',
                }}
              >
                <div style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: wsConnected ? 'var(--accent-green)' : 'var(--accent-maroon)',
                  ...(wsConnected ? { animation: 'status-pulse 2.4s ease-in-out infinite' } : {})
                }} />
                <span className="hide-mobile">{wsConnected ? 'Live' : 'Demo'}</span>
              </motion.div>

              {/* Connect Wallet button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', borderRadius: '10px' }}
              >
                Connect Wallet
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Navigation Tabs ── */}
      <div style={{
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-default)',
        position: 'sticky',
        top: '60px',
        zIndex: 40,
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 1.5rem' }}>
          <div className="scrollbar-none" style={{ display: 'flex', overflowX: 'auto', gap: '0.25rem', padding: '0.5rem 0' }}>
            {tabs.map(({ id, label, icon: Icon, badge }) => (
              <motion.button
                key={id}
                id={`tab-${id}`}
                onClick={() => setActiveTab(id)}
                whileTap={{ scale: 0.97 }}
                className={`nav-tab ${activeTab === id ? 'active' : ''}`}
              >
                <Icon size={14} />
                <span className="hide-mobile">{label}</span>
                {badge && (
                  <span style={{
                    fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.06em',
                    padding: '0.1rem 0.35rem', borderRadius: '99px',
                    background: activeTab === id ? 'rgba(37,99,235,0.15)' : 'var(--accent-green-light)',
                    color: activeTab === id ? 'var(--accent-blue)' : 'var(--accent-green)',
                  }}>
                    {badge}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '1.5rem', minHeight: 'calc(100vh - 200px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-card)', marginTop: '2rem' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={11} color="#fff" />
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>AGENT CAPITAL 2.0</span>
              <span>— The Autonomous Asset Manager for the AI Era</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              Powered by <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>0G Network</span> · <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Anthropic Claude</span> · All trades verified on-chain
            </div>
          </div>
        </div>
      </footer>

      {/* ── Floating FOMO badge ── */}
      <AnimatePresence>
        {showFOMO && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 20 }}
            transition={{ delay: 3, duration: 0.4 }}
            style={{
              position: 'fixed', bottom: '1.5rem', right: '1.5rem',
              background: 'var(--text-primary)',
              color: '#fff',
              borderRadius: 'var(--radius-lg)',
              padding: '0.875rem 1.125rem',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 60,
              maxWidth: '280px',
              cursor: 'pointer',
            }}
            onClick={() => { setActiveTab('marketplace'); setShowFOMO(false); }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🎉</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Join {liveStat.investors.toLocaleString()} investors
                </p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>
                  Making 85% avg APY with verified AI agents
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#34d399' }}>Start investing →</span>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowFOMO(false); }}
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0' }}
              >×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
