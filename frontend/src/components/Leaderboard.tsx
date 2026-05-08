import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy, ArrowUpRight, ArrowDownRight, Flame, CheckCircle,
  TrendingUp, Filter, Search, Star, Zap, Shield
} from 'lucide-react';

const STRATS = ['All', 'Yield', 'Volatility', 'Arbitrage', 'Stable', 'Market Maker'] as const;

const TOP_AGENTS = [
  { rank: 1, name: 'Yield Harvester+', strategy: 'Yield',      apy: 87.3, change: +4.2, sharpe: 1.94, winRate: 71.3, tvl: 2.4,  holders: 1247, trend: 'up',   verified: true, featured: true,  badge: '🔥 TRENDING' },
  { rank: 2, name: 'Volatility Surge', strategy: 'Volatility', apy: 76.1, change: -2.1, sharpe: 1.67, winRate: 68.5, tvl: 1.8,  holders: 892,  trend: 'down', verified: true, featured: true,  badge: '💎 TOP RATED' },
  { rank: 3, name: 'Arbitrage Master', strategy: 'Arbitrage',  apy: 72.8, change: +1.5, sharpe: 1.52, winRate: 74.2, tvl: 1.2,  holders: 567,  trend: 'up',   verified: true, featured: true,  badge: '' },
  { rank: 4, name: 'Stablecoin Pro',   strategy: 'Stable',     apy: 48.2, change: +0.3, sharpe: 1.34, winRate: 89.1, tvl: 3.2,  holders: 2341, trend: 'up',   verified: true, featured: false, badge: '⭐ SAFEST' },
  { rank: 5, name: 'Market Maker Pro', strategy: 'Market Maker',apy: 61.4, change: -3.2, sharpe: 1.28, winRate: 63.2, tvl: 0.92, holders: 345,  trend: 'down', verified: true, featured: false, badge: '' },
  { rank: 6, name: 'DeFi Optimizer',   strategy: 'Yield',      apy: 56.2, change: +1.1, sharpe: 1.08, winRate: 58.9, tvl: 0.75, holders: 321,  trend: 'up',   verified: true, featured: false, badge: '⚡ NEW' },
  { rank: 7, name: 'Cross-Chain Vault',strategy: 'Yield',      apy: 54.8, change: +2.3, sharpe: 1.14, winRate: 64.2, tvl: 0.89, holders: 456,  trend: 'up',   verified: true, featured: false, badge: '' },
  { rank: 8, name: 'Delta Neutral',    strategy: 'Arbitrage',  apy: 52.3, change: +0.8, sharpe: 0.98, winRate: 71.5, tvl: 0.67, holders: 234,  trend: 'up',   verified: true, featured: false, badge: '' },
  { rank: 9, name: 'Staking Elite',    strategy: 'Stable',     apy: 45.6, change: -0.5, sharpe: 1.25, winRate: 85.3, tvl: 1.45, holders: 789,  trend: 'down', verified: true, featured: false, badge: '' },
  { rank: 10,name: 'Omega Fund',       strategy: 'Volatility', apy: 68.9, change: +5.4, sharpe: 1.31, winRate: 59.8, tvl: 0.54, holders: 198,  trend: 'up',   verified: false, featured: false, badge: '⚡ NEW' },
  ...Array.from({ length: 40 }, (_, i) => ({
    rank: 11 + i,
    name: `Agent #${1000 + i + 11}`,
    strategy: STRATS[1 + (i % 5)] as string,
    apy: 35 + Math.round(Math.random() * 30 * 10) / 10,
    change: parseFloat((Math.random() * 6 - 3).toFixed(1)),
    sharpe: parseFloat((0.8 + Math.random() * 0.8).toFixed(2)),
    winRate: parseFloat((45 + Math.random() * 45).toFixed(1)),
    tvl: parseFloat((0.1 + Math.random() * 0.8).toFixed(2)),
    holders: 20 + Math.floor(Math.random() * 400),
    trend: Math.random() > 0.5 ? 'up' : 'down',
    verified: Math.random() > 0.25,
    featured: false,
    badge: '',
  })),
];

const stratColor: Record<string, string> = {
  Yield: '#2563eb', Volatility: '#7c3aed', Arbitrage: '#d97706',
  Stable: '#059669', 'Market Maker': '#0891b2',
};
const stratBg: Record<string, string> = {
  Yield: '#eff6ff', Volatility: '#f5f3ff', Arbitrage: '#fffbeb',
  Stable: '#ecfdf5', 'Market Maker': '#ecfeff',
};

const MEDALS = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const [stratFilter, setStratFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'apy' | 'sharpe' | 'winRate' | 'tvl' | 'holders'>('apy');
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);

  // Live update simulation
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  let agents = TOP_AGENTS.filter(a => {
    if (stratFilter !== 'All' && a.strategy !== stratFilter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'apy')     return b.apy - a.apy;
    if (sortBy === 'sharpe')  return b.sharpe - a.sharpe;
    if (sortBy === 'winRate') return b.winRate - a.winRate;
    if (sortBy === 'tvl')     return b.tvl - a.tvl;
    if (sortBy === 'holders') return b.holders - a.holders;
    return 0;
  });

  const platformStats = [
    { label: 'Total Agents', value: '500+' },
    { label: 'Total TVL', value: '$84M' },
    { label: 'Avg APY', value: '54.2%' },
    { label: 'Investors', value: '12,453' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <Trophy size={28} style={{ color: '#d97706' }} />
              <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Agent Leaderboard
              </h1>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.25rem 0.625rem', borderRadius: '99px',
                background: '#ecfdf5', color: '#059669',
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em',
                border: '1px solid #a7f3d0',
              }}>
                <span className="status-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                LIVE
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>500+ AI trading agents ranked by performance — updated every 5 seconds</p>
          </div>
        </div>

        {/* Platform stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
          {platformStats.map((s, i) => (
            <div key={i} className="card-flat" style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-dim)', marginBottom: '0.25rem' }}>{s.label}</p>
              <p className="font-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--accent-maroon)' }}>{s.value}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="card-flat" style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="input-field" style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.825rem' }}
            />
          </div>

          {/* Strategy filters */}
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {STRATS.map(s => (
              <button key={s} onClick={() => setStratFilter(s)}
                style={{
                  padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                  background: stratFilter === s ? 'var(--accent-blue)' : 'var(--bg-elevated)',
                  color: stratFilter === s ? '#fff' : 'var(--text-muted)',
                }}
              >{s}</button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            style={{
              padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem',
              border: '1px solid var(--border-default)', background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="apy">Sort: APY</option>
            <option value="sharpe">Sort: Sharpe</option>
            <option value="winRate">Sort: Win Rate</option>
            <option value="tvl">Sort: TVL</option>
            <option value="holders">Sort: Holders</option>
          </select>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.625rem' }}>
          Showing {agents.length} agents
        </p>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-clean" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ width: 52 }}>#</th>
                <th>Agent Name</th>
                <th>Strategy</th>
                <th style={{ textAlign: 'right' }}>APY</th>
                <th style={{ textAlign: 'right' }}>24h Δ</th>
                <th style={{ textAlign: 'right' }}>Sharpe</th>
                <th style={{ textAlign: 'right' }}>Win Rate</th>
                <th style={{ textAlign: 'right' }}>TVL</th>
                <th style={{ textAlign: 'right' }}>Holders</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {agents.slice(0, 50).map((a, idx) => (
                <motion.tr key={a.rank} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.015 }}>
                  <td>
                    {a.rank <= 3
                      ? <span style={{ fontSize: '1.1rem' }}>{MEDALS[a.rank - 1]}</span>
                      : <span style={{ fontWeight: 700, color: 'var(--text-dim)' }}>{a.rank}</span>}
                  </td>
                  <td>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{a.name}</span>
                        {a.verified && <CheckCircle size={12} style={{ color: '#059669' }} />}
                        {a.featured && <Flame size={12} style={{ color: '#d97706' }} />}
                      </div>
                      {a.badge && (
                        <span style={{
                          fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.06em',
                          padding: '0.08rem 0.4rem', borderRadius: '99px',
                          background: '#eff6ff', color: 'var(--accent-maroon)',
                        }}>{a.badge}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700,
                      background: stratBg[a.strategy] || '#f1f5f9',
                      color: stratColor[a.strategy] || '#64748b',
                    }}>{a.strategy}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem', fontFamily: 'Outfit, sans-serif' }}>{a.apy.toFixed(1)}%</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                      {a.change > 0 ? <ArrowUpRight size={13} style={{ color: '#059669' }} /> : <ArrowDownRight size={13} style={{ color: '#dc2626' }} />}
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: a.change > 0 ? '#059669' : '#dc2626' }}>
                        {a.change > 0 ? '+' : ''}{a.change}%
                      </span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>{a.sharpe}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: '#059669' }}>{a.winRate}%</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>${a.tvl}M</td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--text-secondary)' }}>{a.holders.toLocaleString()}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button style={{
                      padding: '0.3rem 0.875rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
                      background: 'var(--accent-maroon)', color: '#fff', border: 'none', cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent-blue)')}
                    >
                      Invest
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0.875rem 1rem', borderTop: '1px solid var(--border-default)', background: 'var(--bg-elevated)', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
          Showing top 50 of {agents.length} agents · Sorted by {sortBy.toUpperCase()} · Updates every 5s
        </div>
      </motion.div>

      {/* Legend */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[
          { title: 'Rank Medals', items: ['🥇 #1 — Best overall performer', '🥈 #2 — Silver performer', '🥉 #3 — Bronze performer'] },
          { title: 'Badges', items: ['🔥 Trending — Top 5% this week', '✅ Verified — 0G on-chain proof', '⭐ Safest — Lowest drawdown'] },
          { title: 'Metrics', items: ['APY — Annual % yield', 'Sharpe — Risk-adjusted return', 'Win Rate — Profitable trades %'] },
        ].map((group, i) => (
          <div key={i} className="card-flat" style={{ padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{group.title}</p>
            {group.items.map((item, j) => (
              <p key={j} style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{item}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
