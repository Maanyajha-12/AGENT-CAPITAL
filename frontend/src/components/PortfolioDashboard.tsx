import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowUpRight, ArrowDownRight, RefreshCw, Shield, DollarSign, TrendingUp, AlertCircle, ExternalLink, PieChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from 'recharts';

const PERF = [
  { d: '1 Apr', v: 38000 }, { d: '8 Apr', v: 39800 }, { d: '15 Apr', v: 38200 },
  { d: '22 Apr', v: 41500 }, { d: '29 Apr', v: 43100 }, { d: '6 May', v: 41800 }, { d: 'Today', v: 42347 },
];

const HOLDINGS = [
  { name: 'Yield Harvester+', strategy: 'Yield',      value: 14821, alloc: 35.0, target: 35, apy: 87.3, pnl: +4821, color: 'var(--accent-maroon)' },
  { name: 'Volatility Surge', strategy: 'Volatility', value: 11857, alloc: 28.0, target: 28, apy: 76.1, pnl: +2857, color: '#7c3aed' },
  { name: 'Arbitrage Master', strategy: 'Arbitrage',  value: 8047,  alloc: 19.0, target: 20, apy: 72.8, pnl: +1047, color: '#d97706' },
  { name: 'Stablecoin Pro',   strategy: 'Stable',     value: 5082,  alloc: 12.0, target: 12, apy: 48.2, pnl:  +582, color: '#059669' },
  { name: 'Market Maker Pro', strategy: 'Market Maker',value: 2540, alloc: 6.0,  target: 5,  apy: 61.4, pnl:  +340, color: '#0891b2' },
];

const ACTIVITY = [
  { agent: 'Yield Harvester+', action: 'Harvested Curve rewards', profit: '+$285', time: '2h ago', hash: '0x7a3f...8b2c' },
  { agent: 'Volatility Surge', action: 'Bought ETH momentum play', profit: '+$420', time: '5h ago', hash: '0x4c2a...1f9e' },
  { agent: 'Arbitrage Master', action: 'Uniswap↔Curve arb', profit: '+$142', time: '8h ago', hash: '0x9d1b...3e7c' },
  { agent: 'Stablecoin Pro',   action: 'Rebalanced USDC/USDT',   profit: '+$89',  time: '1d ago',  hash: '0x2f8a...6d4b' },
];

const TooltipBox = ({ active, payload, label }: any) => active && payload?.length ? (
  <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.75rem 1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '0.8rem' }}>
    <p style={{ color: '#64748b', marginBottom: '0.25rem' }}>{label}</p>
    <p style={{ fontWeight: 700, color: 'var(--accent-maroon)' }}>${payload[0].value.toLocaleString()}</p>
  </div>
) : null;

export default function PortfolioDashboard() {
  const [rebalancing, setRebalancing] = useState(false);
  const total = 42347;
  const dailyChange = 1245;
  const daily7d = 8.2;
  const monthly = 18.5;

  const rebalanceNeeded = HOLDINGS.filter(h => Math.abs(h.alloc - h.target) > 1.5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>My Portfolio</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Your AI-managed investment portfolio — all returns 0G verified</p>
      </motion.div>

      {/* Portfolio banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ background: 'linear-gradient(135deg, #1e3a8a, #3730a3)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>Total Portfolio Value</p>
            <p className="font-display" style={{ fontSize: '2.75rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>${total.toLocaleString()}</p>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.625rem' }}>
              {[
                { label: 'Today', val: `+$${dailyChange.toLocaleString()}`, color: '#34d399' },
                { label: '7D Return', val: `+${daily7d}%`, color: '#34d399' },
                { label: '30D Return', val: `+${monthly}%`, color: '#34d399' },
                { label: 'Monthly Dividend', val: '+$1,247', color: '#a78bfa' },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: s.color }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>Withdraw</button>
            <button className="btn-primary" style={{ fontSize: '0.8rem' }}>Deposit More</button>
          </div>
        </div>
      </motion.div>

      {/* Rebalance suggestion */}
      {rebalanceNeeded.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '0.875rem 1.125rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <AlertCircle size={18} style={{ color: '#d97706', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#92400e' }}>Rebalancing Suggested</p>
            <p style={{ fontSize: '0.75rem', color: '#b45309' }}>
              {rebalanceNeeded.map(h => h.name).join(', ')} allocation{rebalanceNeeded.length > 1 ? 's have' : ' has'} drifted from target
            </p>
          </div>
          <button onClick={() => setRebalancing(!rebalancing)} className="btn-primary" style={{ fontSize: '0.78rem', padding: '0.4rem 0.875rem', background: '#d97706', boxShadow: 'none' }}>
            <RefreshCw size={13} /> Rebalance
          </button>
        </motion.div>
      )}

      {/* Charts + Holdings */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
        {/* Performance chart */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Portfolio Performance</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Outperforming S&P 500 by +34%</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERF}>
                <defs>
                  <linearGradient id="gPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<TooltipBox />} />
                <Area type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2.5} fill="url(#gPort)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation donut */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Allocation</h3>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie data={HOLDINGS} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {HOLDINGS.map((h, i) => <Cell key={i} fill={h.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`]} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {HOLDINGS.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: h.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', flex: 1 }}>{h.name}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{h.alloc}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.25rem 0' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Holdings ({HOLDINGS.length} agents)</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-clean" style={{ minWidth: 600 }}>
            <thead>
              <tr><th>Agent</th><th style={{ textAlign: 'right' }}>Value</th><th style={{ textAlign: 'right' }}>Alloc %</th><th style={{ textAlign: 'right' }}>APY</th><th style={{ textAlign: 'right' }}>P&L</th><th style={{ textAlign: 'center' }}>Status</th></tr>
            </thead>
            <tbody>
              {HOLDINGS.map((h, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: h.color }} />
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{h.name}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)' }}>${h.value.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: Math.abs(h.alloc - h.target) > 1.5 ? '#d97706' : 'var(--text-secondary)' }}>{h.alloc}%</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginLeft: '0.25rem' }}>/ {h.target}%</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: '#059669' }}>{h.apy}%</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.2rem' }}>
                      <ArrowUpRight size={13} style={{ color: '#059669' }} />
                      <span style={{ fontWeight: 700, color: '#059669' }}>+${h.pnl.toLocaleString()}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700, background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0' }}>ACTIVE</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick stats + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Risk + Dividend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Shield size={16} style={{ color: '#d97706' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Portfolio Risk Score</h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="font-display" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#d97706' }}>6</div>
              <div>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#d97706' }}>MODERATE</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max drawdown: -8.2%</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sharpe Ratio: 1.94</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.75rem' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <div key={n} style={{ flex: 1, height: 6, borderRadius: 3, background: n <= 6 ? (n <= 3 ? '#059669' : n <= 6 ? '#d97706' : '#dc2626') : 'var(--bg-elevated)' }} />
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <DollarSign size={16} style={{ color: '#059669' }} />
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Passive Income</h4>
            </div>
            {[['Monthly Dividend', '+$1,247'], ['Annual Projection', '+$14,964'], ['Unrealized Gains', '+$8,245']].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-default)' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{k}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Recent Activity</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {ACTIVITY.map((a, i) => (
              <div key={i} style={{ padding: '0.75rem 0', borderBottom: i < ACTIVITY.length - 1 ? '1px solid var(--border-default)' : 'none', display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{a.agent}</p>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.action}</p>
                  <a href="#" style={{ fontSize: '0.65rem', color: 'var(--accent-maroon)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.15rem' }}>
                    <span className="font-mono">{a.hash}</span><ExternalLink size={9} />
                  </a>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#059669' }}>{a.profit}</p>
                  <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
