import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowUpRight, CheckCircle, Zap, RefreshCw, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CHAINS = [
  { name: 'Ethereum',  color: '#627eea', bg: '#eef0ff', tvl: 2.8, apy: 62.4, agents: 124, latency: 12, txCost: 4.20, icon: '⟠' },
  { name: 'Polygon',   color: '#8247e5', bg: '#f0ebff', tvl: 1.4, apy: 71.2, agents: 98,  latency: 2,  txCost: 0.02, icon: '⬡' },
  { name: 'Arbitrum',  color: '#28a0f0', bg: '#eaf6ff', tvl: 1.9, apy: 68.8, agents: 87,  latency: 1,  txCost: 0.15, icon: '◆' },
  { name: '0G Chain',  color: 'var(--accent-maroon)', bg: '#eff6ff', tvl: 0.8, apy: 84.2, agents: 191, latency: 0,  txCost: 0.001,icon: '∅' },
];

const ARB_OPS = [
  { pair: 'ETH/USDC', buyOn: 'Polygon', sellOn: 'Ethereum', spread: 0.32, profit: 1840, status: 'LIVE' },
  { pair: 'BTC/USDC', buyOn: 'Arbitrum', sellOn: 'Ethereum', spread: 0.18, profit: 980, status: 'LIVE' },
  { pair: 'USDC/USDT',buyOn: '0G Chain', sellOn: 'Polygon', spread: 0.07, profit: 420, status: 'EXECUTING' },
  { pair: 'ETH/BTC',  buyOn: '0G Chain', sellOn: 'Arbitrum', spread: 0.12, profit: 670, status: 'PENDING' },
];

const TVL_DATA = CHAINS.map(c => ({ name: c.name, tvl: c.tvl }));

export default function CrossChainDashboard() {
  const [selectedChain, setSelectedChain] = useState(CHAINS[3]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Cross-Chain Omni-Agents</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>AI agents operating across 4 chains simultaneously — unified liquidity, maximum yield</p>
      </motion.div>

      {/* Chain cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {CHAINS.map((c, i) => (
          <motion.div key={c.name} className="card" style={{ padding: '1.25rem', cursor: 'pointer', border: selectedChain.name === c.name ? `2px solid ${c.color}` : '1px solid var(--border-default)', background: selectedChain.name === c.name ? c.bg : '#fff' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }} onClick={() => setSelectedChain(c)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', background: c.bg, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: c.color }}>{c.icon}</div>
                <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{c.name}</span>
              </div>
              <CheckCircle size={14} style={{ color: '#059669' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {[['TVL', `$${c.tvl}M`], ['APY', `${c.apy}%`], ['Agents', c.agents], ['Latency', c.latency === 0 ? '<1ms' : `${c.latency}s`]].map(([l, v]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '6px', padding: '0.375rem 0.5rem' }}>
                  <p style={{ fontSize: '0.58rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{l}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: c.color }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Gas: ${c.txCost}/tx</span>
              <span style={{ color: '#059669', fontWeight: 600 }}>● Connected</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TVL chart + Arb ops */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>TVL by Chain</h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Total $6.9M across all networks</p>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TVL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="M" />
                <Tooltip formatter={(v: any) => [`$${v}M`, 'TVL']} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="tvl" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Live Arb Opportunities</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cross-chain price discrepancies</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.68rem', fontWeight: 600, color: '#059669' }}>
              <span className="status-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} /> LIVE
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ARB_OPS.map((op, i) => (
              <div key={i} style={{ padding: '0.75rem', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>{op.pair}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Buy {op.buyOn} → Sell {op.sellOn}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#059669', fontSize: '0.8rem' }}>+${op.profit.toLocaleString()}/hr</p>
                  <span style={{
                    fontSize: '0.58rem', fontWeight: 700, padding: '0.1rem 0.4rem', borderRadius: '99px',
                    background: op.status === 'LIVE' ? '#ecfdf5' : op.status === 'EXECUTING' ? '#eff6ff' : '#fffbeb',
                    color: op.status === 'LIVE' ? '#059669' : op.status === 'EXECUTING' ? '#2563eb' : '#d97706',
                  }}>{op.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Omni-agent explainer */}
      <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>🌐 How Omni-Agents Work</h3>
        <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Omni-agents monitor prices on ALL chains simultaneously. When ETH is cheaper on Polygon by 0.3%, the agent bridges USDC, buys ETH on Polygon, bridges back to Ethereum, and sells — capturing the spread automatically.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {[
            { label: 'Single-chain APY', val: '60–80%', icon: '⛓️' },
            { label: 'Omni-chain APY', val: '120–150%', icon: '🌐' },
            { label: 'Daily Arb Cycles', val: '200+', icon: '🔄' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '10px', padding: '0.875rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
              <p className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-maroon)', marginTop: '0.25rem' }}>{s.val}</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
