import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const MONTHLY = [
  { m: 'Nov', tvl: 12, profit: 0.8, users: 890 }, { m: 'Dec', tvl: 18, profit: 1.2, users: 1240 },
  { m: 'Jan', tvl: 28, profit: 1.9, users: 2100 }, { m: 'Feb', tvl: 38, profit: 2.8, users: 4200 },
  { m: 'Mar', tvl: 52, profit: 3.9, users: 7800 }, { m: 'Apr', tvl: 68, profit: 5.1, users: 10200 },
  { m: 'May', tvl: 84, profit: 6.3, users: 12453 },
];

const AGENT_METRICS = [
  { name: 'Yield Harvester+', sharpe: 1.94, apy: 87.3, drawdown: 8.2,  color: 'var(--accent-maroon)' },
  { name: 'Volatility Surge', sharpe: 1.67, apy: 76.1, drawdown: 15.2, color: '#7c3aed' },
  { name: 'Arbitrage Master', sharpe: 1.52, apy: 72.8, drawdown: 5.8,  color: '#d97706' },
  { name: 'Stablecoin Pro',   sharpe: 1.34, apy: 48.2, drawdown: 2.1,  color: '#059669' },
  { name: 'Epsilon Core',     sharpe: 2.01, apy: 95.0, drawdown: 7.5,  color: '#f59e0b' },
  { name: 'Market Maker Pro', sharpe: 1.28, apy: 61.4, drawdown: 9.1,  color: '#0891b2' },
];

const HEATMAP_AGENTS = AGENT_METRICS;
const HEATMAP_METRICS = ['APY', 'Sharpe', 'Win Rate', 'Drawdown', 'Profit Factor'];
const HEATMAP_DATA = [
  [87, 97, 71, 82, 93],
  [76, 84, 69, 48, 78],
  [73, 76, 74, 94, 86],
  [48, 67, 89, 98, 95],
  [95, 100, 78, 88, 90],
  [61, 64, 63, 82, 72],
];

function getHeatColor(val: number) {
  if (val >= 85) return { bg: '#ecfdf5', color: '#059669' };
  if (val >= 70) return { bg: '#eff6ff', color: 'var(--accent-maroon)' };
  if (val >= 55) return { bg: '#fffbeb', color: '#d97706' };
  return { bg: '#fef2f2', color: '#dc2626' };
}

export default function SystemStats() {
  const [compare1, setCompare1] = useState(0);
  const [compare2, setCompare2] = useState(1);

  const a1 = AGENT_METRICS[compare1], a2 = AGENT_METRICS[compare2];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Platform Analytics</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Real-time platform metrics — growth, revenue, and agent performance heatmap</p>
      </motion.div>

      {/* Platform KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Total TVL',      val: '$84M',   change: '+23% MoM', icon: DollarSign, color: 'var(--accent-maroon)' },
          { label: 'Total Profit',   val: '$6.3M',  change: '+31% MoM', icon: TrendingUp, color: '#059669' },
          { label: 'Active Users',   val: '12,453', change: '+22% MoM', icon: Users,      color: '#7c3aed' },
          { label: 'Agents Deployed',val: '500+',   change: '+45 this week', icon: BarChart3, color: '#d97706' },
          { label: 'Platform Revenue',val:'$630K',  change: 'This month', icon: DollarSign, color: '#0891b2' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} className="metric-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="metric-label">{s.label}</span>
                <div style={{ padding: '0.35rem', borderRadius: '6px', background: `${s.color}15` }}>
                  <Icon size={14} style={{ color: s.color }} />
                </div>
              </div>
              <div className="metric-value" style={{ fontSize: '1.5rem' }}>{s.val}</div>
              <div className="metric-change up"><ArrowUpRight size={12} />{s.change}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Growth charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>TVL Growth ($M)</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>7× growth in 6 months</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY}>
                <defs><linearGradient id="gTVL" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: any) => [`$${v}M`]} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="tvl" stroke="#2563eb" strokeWidth={2.5} fill="url(#gTVL)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>User Growth</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>14× growth in 6 months</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="users" fill="#7c3aed" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card" style={{ padding: '1.25rem', overflow: 'auto' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>Agent Performance Heatmap</h3>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Normalized scores (0–100) across all key metrics</p>
        <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: 500 }}>
          <thead>
            <tr>
              <th style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Agent</th>
              {HEATMAP_METRICS.map(m => (
                <th key={m} style={{ padding: '0.5rem', textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HEATMAP_AGENTS.map((a, i) => (
              <tr key={a.name}>
                <td style={{ padding: '0.5rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color }} />
                    {a.name}
                  </div>
                </td>
                {HEATMAP_DATA[i].map((val, j) => {
                  const { bg, color } = getHeatColor(val);
                  return (
                    <td key={j} style={{ padding: '0.375rem 0.5rem', textAlign: 'center' }}>
                      <div style={{ padding: '0.3rem 0.5rem', borderRadius: '6px', background: bg, color, fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>{val}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.875rem', flexWrap: 'wrap' }}>
          {[['≥85 Excellent', '#059669', '#ecfdf5'], ['70–84 Good', '#2563eb', '#eff6ff'], ['55–69 Fair', '#d97706', '#fffbeb'], ['<55 Needs work', '#dc2626', '#fef2f2']].map(([l, c, bg]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: bg as string, border: `1px solid ${c}30` }} />
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-side compare */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem' }}>Agent Comparison</h3>
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {['Agent A:', 'Agent B:'].map((label, idx) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</span>
              <select value={idx === 0 ? compare1 : compare2} onChange={e => idx === 0 ? setCompare1(+e.target.value) : setCompare2(+e.target.value)}
                style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', border: '1px solid var(--border-default)', background: '#fff', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}>
                {AGENT_METRICS.map((a, i) => <option key={i} value={i}>{a.name}</option>)}
              </select>
            </div>
          ))}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)' }}>
                <th style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Metric</th>
                <th style={{ padding: '0.625rem 1rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: a1.color }}>{a1.name}</th>
                <th style={{ padding: '0.625rem 1rem', textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: a2.color }}>{a2.name}</th>
              </tr>
            </thead>
            <tbody>
              {[['APY', `${a1.apy}%`, `${a2.apy}%`, a1.apy > a2.apy ? 0 : 1], ['Sharpe Ratio', a1.sharpe, a2.sharpe, a1.sharpe > a2.sharpe ? 0 : 1], ['Max Drawdown', `-${a1.drawdown}%`, `-${a2.drawdown}%`, a1.drawdown < a2.drawdown ? 0 : 1]].map(([metric, v1, v2, winner]) => (
                <tr key={metric as string} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{metric}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 800, color: winner === 0 ? '#059669' : 'var(--text-secondary)' }}>{v1}{winner === 0 && ' ✓'}</td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 800, color: winner === 1 ? '#059669' : 'var(--text-secondary)' }}>{v2}{winner === 1 && ' ✓'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
