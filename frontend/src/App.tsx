import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Briefcase, Trophy, ShoppingBag, Zap, Dna, Shield,
  TrendingUp, Bell, Wallet, Settings, LogOut,
  Search, User, Menu, X
} from 'lucide-react';
import { useToast } from './components/Toast';
import { connectMetaMask, truncateAddress, liveFeed } from './services/api';

import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import RealityCheckDashboard from './components/RealityCheckDashboard';
import MarketplacePanel from './components/MarketplacePanel';
import PortfolioDashboard from './components/PortfolioDashboard';
import StrategyPanel from './components/StrategyPanel';
import BreedingLab from './components/BreedingLab';
import LandingPage from './components/LandingPage';

const TICKER = [
  '🟢 0G Galileo Testnet · Chain ID 16602 · Live',
  '⚡ Yield Harvester+ APY: fetching from Aave V3…',
  '🔵 0G verified agent decisions on-chain this session',
  '🟢 DeFi Llama API · Real protocol yield data',
  '🧬 Agent Breeding Lab · Create superior strategies',
  '🛡️ ProofOfIntelligence.sol · TEE verification live',
  '🔗 chainscan-galileo.0g.ai · All txns verifiable',
  '🟢 Stablecoin Pro APY: Aave V3 USDT supply rate',
  '⚡ 0G Compute Router · Every decision cryptographically proven',
  '🌐 0G KV Storage · Agent state persisted on-chain',
];

const NAV = [
  { id: 'overview', label: 'Overview', icon: BarChart3, badge: null },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase, badge: null },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'LIVE' },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: null },
  { id: 'strategies', label: 'Strategies', icon: Zap, badge: null },
  { id: 'breeding', label: 'Breeding Lab', icon: Dna, badge: 'NEW' },
  { id: 'reality', label: 'Reality Check', icon: Shield, badge: 'VERIFY' },
];

const BADGE_COLORS: Record<string, { bg: string; color: string }> = {
  LIVE: { bg: 'rgba(16,185,129,0.15)', color: '#34D399' },
  'NEW': { bg: 'rgba(59,130,246,0.15)', color: '#60A5FA' },
  '500+': { bg: 'rgba(139,92,246,0.15)', color: '#A78BFA' },
  'VERIFY': { bg: 'rgba(34,197,94,0.15)', color: '#22C55E' },
};

const PAGES: Record<string, React.ComponentType<any>> = {
  overview: Dashboard,
  portfolio: PortfolioDashboard,
  leaderboard: Leaderboard,
  marketplace: MarketplacePanel,
  strategies: StrategyPanel,
  breeding: BreedingLab,
  reality: RealityCheckDashboard,
};

export default function App() {
  const { toast } = useToast();
  const [page, setPage] = useState('overview');
  const [showLanding, setShowLanding] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3);
  const [investors, setInvestors] = useState(12467);
  const [showNotif, setShowNotif] = useState(false);
  const walletConnected = !!walletAddress;

  useEffect(() => {
    const t = setInterval(() => setInvestors(v => v + Math.floor(Math.random() * 3)), 8000);
    // Connect live feed
    liveFeed.connect();
    return () => { clearInterval(t); liveFeed.disconnect(); };
  }, []);

  const handleWalletConnect = async () => {
    if (walletConnected) {
      setWalletAddress(null);
      toast('info', 'Wallet Disconnected', 'Session ended');
      return;
    }
    // Try MetaMask first
    const addr = await connectMetaMask();
    if (addr) {
      setWalletAddress(addr);
      toast('success', 'Wallet Connected', `${truncateAddress(addr)} ready`);
    } else {
      // Demo mode — simulate connect
      const demoAddr = '0x7a3f8B9d2c1E4F5a6D7e8F9a0B1c2D3e4F5a6D7e';
      setWalletAddress(demoAddr);
      toast('success', 'Demo Wallet Connected', `${truncateAddress(demoAddr)} (demo mode)`);
    }
  };

  if (showLanding) return <LandingPage onLaunchApp={(page?: string) => { setShowLanding(false); if (page) setPage(page); }} />;

  const Page = PAGES[page] || Dashboard;

  return (
    <div className="app-layout" onClick={() => { if (sidebarOpen) setSidebarOpen(false); }}>
      {/* Ambient background orbs */}
      <div className="orb orb-blue" style={{ width: 700, height: 700, top: -250, left: -150, opacity: 0.5 }} />
      <div className="orb orb-green" style={{ width: 600, height: 600, bottom: -200, right: -150, opacity: 0.4 }} />
      <div className="orb orb-purple" style={{ width: 500, height: 500, top: '35%', left: '38%', opacity: 0.25 }} />
      <div className="grid-overlay" style={{ opacity: 0.6 }} />

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 199, backdropFilter: 'blur(4px)' }} />
      )}

      {/* ══ SIDEBAR ══════════════════════════════════════════════════ */}
      <aside className={`sidebar${sidebarOpen ? ' mobile-open' : ''}`} onClick={e => e.stopPropagation()}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem 0.875rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 11, background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(139,92,246,0.2)', flexShrink: 0 }}>
              <TrendingUp size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'Outfit,sans-serif', letterSpacing: '-0.01em' }}>
                AGENT <span className="gradient-text-blue">CAPITAL</span>
              </div>
              <div style={{ fontSize: '0.52rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                AI Asset Management
              </div>
            </div>
          </div>
        </div>

        {/* Live status */}
        <div style={{ padding: '0.625rem 0.875rem' }}>
          <motion.div animate={{ boxShadow: ['0 0 0 0 rgba(16,185,129,0.3)', '0 0 0 6px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0)'] }} transition={{ duration: 2.5, repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.07)', borderRadius: 10, border: '1px solid rgba(16,185,129,0.15)' }}>
            <div className="live-dot" style={{ width: 6, height: 6, background: 'var(--green)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--green-l)' }}>{investors.toLocaleString()} online now</span>
          </motion.div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.25rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.1rem', overflowY: 'auto' }} className="scrollbar-none">
          <p style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0.5rem 0.375rem 0.25rem', marginTop: '0.25rem' }}>Platform</p>
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = page === item.id;
            return (
              <motion.button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`nav-item ${isActive ? 'active' : ''}`}
                whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <Icon size={15} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '0.1rem 0.35rem', background: BADGE_COLORS[item.badge]?.bg || 'rgba(59,130,246,0.15)', color: BADGE_COLORS[item.badge]?.color || 'var(--blue-l)', borderRadius: 99, letterSpacing: '0.04em' }}>
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <motion.div layoutId="activeIndicator" style={{ width: 3, height: 16, background: 'var(--blue)', borderRadius: 99, marginLeft: 'auto' }} />
                )}
              </motion.button>
            );
          })}

          <p style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0.75rem 0.375rem 0.25rem' }}>Account</p>
          <button className="nav-item"><Settings size={15} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => setShowLanding(true)}><LogOut size={15} /><span>Home</span></button>
        </nav>

        {/* Bottom stats + 0G proof */}
        <div style={{ margin: '0.625rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ padding: '0.875rem 1rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.07), rgba(139,92,246,0.05))', borderRadius: 'var(--r-lg)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <p style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Contracts on 0G Galileo</p>
            {[['INFT', '0x1cd6…2d59'], ['POI', '0xdc83…bf2'], ['Registry', '0xc810…2e6']].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.1rem 0', fontSize: '0.7rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight: 700, color: '#60A5FA', fontFamily: 'monospace', fontSize: '0.62rem' }}>{v}</span>
              </div>
            ))}
          </div>
          {/* 0G Chain proof */}
          <a href="https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 'var(--r-lg)', textDecoration: 'none', cursor: 'pointer' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#34D399' }}>Live on 0G Galileo</div>
              <div style={{ fontSize: '0.55rem', color: '#475569', fontFamily: 'monospace' }}>0x1cd6...2d59 ↗</div>
            </div>
          </a>
        </div>
      </aside>

      {/* ══ MAIN ═════════════════════════════════════════════════════ */}
      <div className="main-content">
        {/* Ticker */}
        <div style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08), rgba(16,185,129,0.1))', borderBottom: '1px solid rgba(59,130,246,0.12)', overflow: 'hidden', height: 28, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ flexShrink: 0, padding: '0 0.75rem', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <div className="live-dot" style={{ width: 5, height: 5, background: 'var(--green)' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--green)', letterSpacing: '0.1em' }}>LIVE</span>
          </div>
          <div className="ticker-track scrollbar-none" style={{ display: 'flex', gap: '2.5rem', whiteSpace: 'nowrap', alignItems: 'center', flex: 1 }}>
            {[...TICKER, ...TICKER].map((t, i) => (
              <span key={i} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Topbar */}
        <div className="topbar" style={{ padding: '0 1.5rem', gap: '1rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input placeholder="Search agents, strategies..." className="input-field hide-mobile"
                style={{ paddingLeft: '2rem', height: 34, fontSize: '0.78rem', width: 240, background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-md)' }} />
            </div>
            {/* Breadcrumb */}
            <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <span>Platform</span>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'capitalize' }}>{page}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* AI pulse */}
            <div className="ai-pulse-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.75rem', background: 'rgba(139,92,246,0.1)', borderRadius: 'var(--r-full)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--purple)' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--purple-l)' }}>AI Active</span>
            </div>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button style={{ position: 'relative', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-default)', cursor: 'pointer', padding: '0.4rem', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => setShowNotif(v => !v)}>
                <Bell size={16} style={{ color: 'var(--text-muted)' }} />
                {notifications > 0 && (
                  <span style={{ position: 'absolute', top: -3, right: -3, width: 14, height: 14, background: 'var(--blue)', borderRadius: '50%', fontSize: '0.48rem', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{notifications}</span>
                )}
              </button>
              <AnimatePresence>
                {showNotif && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                    style={{ position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)', width: 320, background: 'rgba(8,12,24,0.98)', border: '1px solid var(--border-bright)', borderRadius: 'var(--r-xl)', boxShadow: 'var(--shadow-xl)', zIndex: 100, padding: '1rem', backdropFilter: 'blur(24px)' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Notifications</p>
                    {[
                      { msg: 'Yield Harvester+ generated $340 yield', time: '2m ago', color: '#3B82F6' },
                      { msg: 'New breeding opportunity available', time: '1h ago', color: '#8B5CF6' },
                      { msg: 'Portfolio up 2.3% today', time: '3h ago', color: '#10B981' },
                    ].map((n, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.625rem', padding: '0.625rem', borderRadius: 'var(--r-md)', background: 'rgba(255,255,255,0.025)', border: `1px solid ${n.color}15`, marginBottom: '0.5rem' }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: n.color, marginTop: 4, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{n.msg}</p>
                          <p style={{ fontSize: '0.62rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile menu */}
            <button className="btn-ghost" style={{ height: 34, width: 34, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={e => { e.stopPropagation(); setSidebarOpen(v => !v); }}>
              <Menu size={16} />
            </button>

            {/* Wallet */}
            <button onClick={handleWalletConnect}
              className={walletConnected ? 'btn-ghost' : 'btn-primary'}
              style={{ height: 34, fontSize: '0.78rem', padding: '0 1rem', gap: '0.375rem', borderRadius: 'var(--r-md)' }}>
              <Wallet size={13} />
              {walletConnected ? truncateAddress(walletAddress!) : 'Connect Wallet'}
            </button>

            {/* Avatar */}
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 0 12px rgba(59,130,246,0.4)', flexShrink: 0 }}>
              <User size={15} color="#fff" />
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', position: 'relative', zIndex: 1 }} className="scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
              <Page />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ══ MOBILE BOTTOM NAV ════════════════════════════════════════ */}
      <nav className="mobile-nav">
        {NAV.slice(0, 5).map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`mobile-nav-item ${page === item.id ? 'active' : ''}`}>
              <Icon />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
