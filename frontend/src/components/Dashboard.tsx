import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Activity, Zap, Flame, Shield, Award, Users, DollarSign,
  BarChart3, CheckCircle, ExternalLink, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const PERF_DATA = [
  { date: '1 Apr', value: 95000, bench: 94000 },
  { date: '8 Apr', value: 102000, bench: 95800 },
  { date: '15 Apr', value: 98500,  bench: 95200 },
  { date: '22 Apr', value: 115000, bench: 97100 },
  { date: '29 Apr', value: 121000, bench: 98500 },
  { date: '6 May',  value: 134000, bench: 99800 },
  { date: 'Today',  value: 142300, bench: 101200 },
];

const ALLOC_DATA = [
  { name: 'Yield',      value: 40, color: '#2563eb' },
  { name: 'Volatility', value: 30, color: '#7c3aed' },
  { name: 'Arbitrage',  value: 20, color: '#d97706' },
  { name: 'Stable',     value: 10, color: '#059669' },
];

const TOP_AGENTS = [
  { id: '1', name: 'Yield Harvester+', strategy: 'Yield',      apy: 87.3, winRate: 71.3, sharpe: 1.94, drawdown: 8.2,  tvl: 2.4,  holders: 1247, trend: 'up',   color: '#2563eb' },
  { id: '2', name: 'Volatility Surge', strategy: 'Volatility', apy: 76.1, winRate: 68.5, sharpe: 1.67, drawdown: 15.2, tvl: 1.8,  holders: 892,  trend: 'up',   color: '#7c3aed' },
  { id: '3', name: 'Arbitrage Master', strategy: 'Arbitrage',  apy: 72.8, winRate: 74.2, sharpe: 1.52, drawdown: 5.8,  tvl: 1.2,  holders: 567,  trend: 'flat', color: '#d97706' },
  { id: '4', name: 'Stablecoin Pro',   strategy: 'Stable',     apy: 48.2, winRate: 89.1, sharpe: 1.34, drawdown: 2.1,  tvl: 3.2,  holders: 2341, trend: 'down', color: '#059669' },
];

const ACTIVITY = [
  { agent: 'Yield Harvester+', action: 'Harvested USDC from Curve pool', value: '+$285', time: '2m ago', hash: '0x7a3f...8b2c', positive: true },
  { agent: 'Volatility Surge',  action: 'Bought ETH on momentum signal',   value: '+$420', time: '18m ago', hash: '0x4c2a...1f9e', positive: true },
  { agent: 'Arbitrage Master',  action: 'Cross-DEX arbitrage executed',     value: '+$142', time: '45m ago', hash: '0x9d1b...3e7c', positive: true },
  { agent: 'Stablecoin Pro',    action: 'Rebalanced USDC/USDT positions',   value: '+$89',  time: '2h ago',  hash: '0x2f8a...6d4b', positive: true },
  { agent: 'Yield Harvester+', action: 'Compounded Aave interest rewards',  value: '+$156', time: '4h ago',  hash: '0x5e3c...9a1f', positive: true },
];

function CountUp({ end, prefix = '', suffix = '', decimals = 0 }: { end: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return <>{prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()}{suffix}</>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.75rem 1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <p style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.375rem' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ fontSize: '0.8rem', fontWeight: 700, color: p.color }}>
          {p.name}: ${(p.value / 1000).toFixed(1)}K
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [period, setPeriod] = useState<'7D' | '30D' | '90D'>('30D');

  const metrics = [
    { label: 'Portfolio Value', value: 142300, prefix: '$', suffix: '', display: '$142.3K', change: '+66.4%', up: true, icon: DollarSign, sub: 'vs $85.5K invested', color: '#2563eb' },
    { label: 'Total Profit',   value: 56800,  prefix: '$', suffix: '', display: '$56.8K',  change: '+$1,245 today', up: true, icon: TrendingUp, sub: 'All time returns', color: '#059669' },
    { label: 'Avg APY',        value: 71.2,   prefix: '',  suffix: '%', display: '71.2%',  change: '+3.1% vs last week', up: true, icon: Award,  sub: 'Across 4 agents',  color: '#7c3aed' },
    { label: 'Risk Score',     value: 6,      prefix: '',  suffix: '/10', display: '6/10', change: 'MODERATE',   up: null, icon: Shield, sub: 'Max drawdown: -8.2%', color: '#d97706' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Hero header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Agent Capital <span className="gradient-text">2.0</span>
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Professional autonomous AI asset management — verified by 0G Compute
        </p>
      </motion.div>

      {/* Platform banner */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{
          background: 'linear-gradient(135deg, #3d1a00 0%, #7f1d1d 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.5rem',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
        }}
      >
        {[
          { label: 'Platform Profit', value: '$84M+', icon: '💰' },
          { label: 'Active Investors', value: '12,453', icon: '👥' },
          { label: 'Agents Deployed', value: '500+', icon: '🤖' },
          { label: '0G Verified Trades', value: '247K+', icon: '✅' },
          { label: 'Hacks / Blowups', value: '0', icon: '🛡️' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.1rem' }}>{s.icon}</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#fff', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Metric cards */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}
      >
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div key={i} className="metric-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className="metric-label">{m.label}</span>
                <div style={{ padding: '0.4rem', borderRadius: '8px', background: `${m.color}15` }}>
                  <Icon size={16} style={{ color: m.color }} />
                </div>
              </div>
              <div className="metric-value">{m.display}</div>
              <div className={`metric-change ${m.up === true ? 'up' : m.up === false ? 'down' : 'flat'}`} style={{ marginTop: '0.375rem' }}>
                {m.up === true && <ArrowUpRight size={13} />}
                {m.up === false && <ArrowDownRight size={13} />}
                {m.change}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{m.sub}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts row */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}
      >
        {/* Performance chart */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Portfolio vs Benchmark</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Outperforming S&P 500 by +34%</p>
            </div>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {(['7D','30D','90D'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{
                    padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: period === p ? 'var(--accent-maroon)' : 'var(--bg-elevated)',
                    color: period === p ? '#fffef9' : 'var(--text-muted)',
                  }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERF_DATA}>
                <defs>
                  <linearGradient id="gPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7f1d1d" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#7f1d1d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8ddd0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Area type="monotone" dataKey="value" stroke="#7f1d1d" strokeWidth={2.5} fill="url(#gPortfolio)" name="Portfolio" />
                <Line type="monotone" dataKey="bench" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" name="S&P 500" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Asset Allocation</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Across 4 active agents</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ALLOC_DATA} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={2} dataKey="value">
                  {ALLOC_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`]} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            {ALLOC_DATA.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top Agents + Activity */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}
      >
        {/* Top agents */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Flame size={18} style={{ color: '#d97706' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Top Performing Agents</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {TOP_AGENTS.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                style={{
                  padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
                  background: 'var(--bg-elevated)', cursor: 'pointer', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = a.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-default)')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{a.name}</span>
                    {i === 0 && <span style={{ fontSize: '0.6rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '99px', background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' }}>🔥 HOT</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    {a.trend === 'up' && <ArrowUpRight size={13} style={{ color: '#059669' }} />}
                    {a.trend === 'down' && <ArrowDownRight size={13} style={{ color: '#dc2626' }} />}
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#059669', fontFamily: 'Outfit, sans-serif' }}>{a.apy}%</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem' }}>
                  {[
                    { label: 'Win Rate', val: `${a.winRate}%`, color: '#059669' },
                    { label: 'Sharpe',   val: a.sharpe.toFixed(2), color: 'var(--text-primary)' },
                    { label: 'Drawdown', val: `-${a.drawdown}%`, color: '#dc2626' },
                    { label: 'TVL',      val: `$${a.tvl}M`, color: 'var(--text-primary)' },
                  ].map((m, j) => (
                    <div key={j} style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: m.color }}>{m.val}</div>
                    </div>
                  ))}
                </div>
                <button style={{
                  width: '100%', marginTop: '0.625rem', padding: '0.4rem',
                  background: `${a.color}12`, color: a.color, border: `1px solid ${a.color}30`,
                  borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                }}>
                  Invest in this agent →
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live activity */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} style={{ color: '#2563eb' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live Agent Activity</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.7rem', fontWeight: 600, color: '#059669' }}>
              <div className="status-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669' }} />
              LIVE
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {ACTIVITY.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{
                  padding: '0.75rem 0',
                  borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border-default)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.1rem' }}>
                    <CheckCircle size={12} style={{ color: '#059669', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.agent}</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{a.action}</p>
                  <a
                    href={`https://chainscan-galileo.0g.ai/tx/${a.hash}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: '0.65rem', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    <span className="font-mono">{a.hash}</span>
                    <ExternalLink size={9} />
                  </a>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>{a.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{a.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

    </div>
  );
}
