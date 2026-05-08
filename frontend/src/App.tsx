import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Briefcase, Trophy, ShoppingBag, Zap, Dna, Shield,
  Globe, Activity, TrendingUp, Bell, User, Wallet, ChevronRight,
  Settings, LogOut, Search, X, ExternalLink
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import MarketplacePanel from './components/MarketplacePanel';
import PortfolioDashboard from './components/PortfolioDashboard';
import StrategyPanel from './components/StrategyPanel';
import Gallery from './components/Gallery';
import ArenaPanel from './components/ArenaPanel';
import CrossChainDashboard from './components/CrossChainDashboard';
import SystemStats from './components/SystemStats';
import LandingPage from './components/LandingPage';

const TICKER_ITEMS = [
  '🟢 ETH/USDC +2.4%', '⚡ Yield Harvester+ executed $12,400 trade',
  '🔵 0G verified 247 trades this hour', '🟢 BTC $84,210 +1.8%',
  '🧬 Epsilon Core Gen 4 breeding complete', '💰 Platform profit $84.2M total',
  '🔥 Volatility Surge ranked #1 this week', '🟢 ARB/ETH +3.2%',
  '💎 Stablecoin Pro hit 89.1% win rate', '⚡ $2.3M profit distributed today',
  '🌐 Cross-chain arb: ETH/Polygon +$1,840/hr', '🟢 SOL/USDC +4.1%',
];

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',      icon: BarChart3 },
  { id: 'portfolio',  label: 'Portfolio',      icon: Briefcase },
  { id: 'leaderboard',label: 'Leaderboard',   icon: Trophy },
  { id: 'marketplace',label: 'Marketplace',   icon: ShoppingBag },
  { id: 'strategies', label: 'Strategies',    icon: Zap },
  { id: 'breeding',   label: 'Breeding Lab',  icon: Dna },
  { id: 'reputation', label: 'Reputation',    icon: Shield },
  { id: 'crosschain', label: 'Cross-Chain',   icon: Globe },
  { id: 'analytics',  label: 'Analytics',     icon: Activity },
];

const PAGE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  overview:    Dashboard,
  portfolio:   PortfolioDashboard,
  leaderboard: Leaderboard,
  marketplace: MarketplacePanel,
  strategies:  StrategyPanel,
  breeding:    Gallery,
  reputation:  ArenaPanel,
  crosschain:  CrossChainDashboard,
  analytics:   SystemStats,
};

export default function App() {
  const [page, setPage] = useState('overview');
  const [showLanding, setShowLanding] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [walletConnected, setWalletConnected] = useState(false);
  const [investors, setInvestors] = useState(12467);

  useEffect(() => {
    const interval = setInterval(() => {
      setInvestors(v => v + Math.floor(Math.random() * 3));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (showLanding) {
    return <LandingPage onLaunchApp={() => setShowLanding(false)} />;
  }

  const PageComponent = PAGE_COMPONENTS[page] || Dashboard;

  return (
    <div className="app-layout">
      {/* Ambient orbs */}
      <div className="orb orb-blue" style={{ width: 600, height: 600, top: -200, left: -100, opacity: 0.6 }} />
      <div className="orb orb-green" style={{ width: 500, height: 500, bottom: -150, right: -100, opacity: 0.5 }} />
      <div className="orb orb-purple" style={{ width: 400, height: 400, top: '40%', left: '40%', opacity: 0.3 }} />

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(59,130,246,0.4)',
            }}>
              <TrendingUp size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.01em' }}>
                AGENT <span className="gradient-text-blue">CAPITAL</span>
              </div>
              <div style={{ fontSize: '0.55rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                AI Asset Management
              </div>
            </div>
          </div>
        </div>

        {/* Live status */}
        <div style={{ padding: '0.625rem 1rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 0.625rem',
            background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--r-md)',
            border: '1px solid rgba(16,185,129,0.15)',
          }}>
            <div className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--green-l)' }}>
              {investors.toLocaleString()} investors online
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.25rem 0.625rem', display: 'flex', flexDirection: 'column', gap: '0.15rem', overflowY: 'auto' }} className="scrollbar-none">
          <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0.5rem 0.25rem 0.25rem', marginTop: '0.25rem' }}>
            Platform
          </p>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <motion.button key={item.id} onClick={() => setPage(item.id)}
                className={`nav-item ${page === item.id ? 'active' : ''}`}
                whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                <Icon size={15} />
                <span>{item.label}</span>
                {item.id === 'leaderboard' && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.58rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: 'rgba(16,185,129,0.15)', color: 'var(--green-l)', borderRadius: 99 }}>LIVE</span>
                )}
                {item.id === 'marketplace' && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.58rem', fontWeight: 700, padding: '0.1rem 0.35rem', background: 'rgba(59,130,246,0.12)', color: 'var(--blue-l)', borderRadius: 99 }}>500+</span>
                )}
              </motion.button>
            );
          })}

          <p style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '0.75rem 0.25rem 0.25rem' }}>
            Account
          </p>
          <button className="nav-item"><Settings size={15} /><span>Settings</span></button>
          <button className="nav-item" onClick={() => setShowLanding(true)}><LogOut size={15} /><span>Landing</span></button>
        </nav>

        {/* Platform stats */}
        <div style={{
          margin: '0.625rem', padding: '0.875rem',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.06))',
          borderRadius: 'var(--r-lg)', border: '1px solid rgba(59,130,246,0.15)',
        }}>
          <p style={{ fontSize: '0.6rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Platform</p>
          {[
            ['TVL', '$84.2M'], ['Avg APY', '60.2%'], ['Agents', '500+'], ['Hacks', '0'],
          ].map(([l, v]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.15rem 0', fontSize: '0.72rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{l}</span>
              <span style={{ fontWeight: 700, color: '#F8FAFC' }}>{v}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────── */}
      <div className="main-content">
        {/* Live ticker */}
        <div style={{
          background: 'linear-gradient(90deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1), rgba(16,185,129,0.12))',
          borderBottom: '1px solid rgba(59,130,246,0.15)',
          overflow: 'hidden', height: 30, display: 'flex', alignItems: 'center',
        }}>
          <div style={{ flexShrink: 0, padding: '0 0.625rem', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div className="live-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--green)', letterSpacing: '0.1em' }}>LIVE</span>
          </div>
          <div className="ticker-track scrollbar-none" style={{ display: 'flex', gap: '2.5rem', whiteSpace: 'nowrap', alignItems: 'center', flex: 1 }}>
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i} style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Topbar */}
        <div className="topbar" style={{ padding: '0 1.5rem', gap: '1rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.625rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input placeholder="Search agents, strategies..." className="input-field hide-mobile"
                style={{ paddingLeft: '2rem', height: 34, fontSize: '0.8rem', width: 240, background: 'rgba(255,255,255,0.04)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* AI pulse */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.3rem 0.625rem', background: 'rgba(139,92,246,0.1)', borderRadius: 'var(--r-full)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--purple)', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--purple-l)' }}>AI Active</span>
            </div>

            {/* Notifications */}
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
              <Bell size={17} style={{ color: 'var(--text-muted)' }} />
              {notifications > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, background: 'var(--blue)', borderRadius: '50%', fontSize: '0.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {notifications}
                </span>
              )}
            </button>

            {/* Connect wallet */}
            <button onClick={() => setWalletConnected(v => !v)} className={walletConnected ? 'btn-ghost' : 'btn-primary'}
              style={{ height: 34, fontSize: '0.78rem', padding: '0 0.875rem', gap: '0.375rem' }}>
              <Wallet size={13} />
              {walletConnected ? '0x7a3f...d4c2' : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', position: 'relative', zIndex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}>
              <PageComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
