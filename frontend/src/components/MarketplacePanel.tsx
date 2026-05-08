import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, CheckCircle, Flame, TrendingUp, ArrowUpRight, Users, DollarSign, X } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const stratColor: Record<string, string> = { Yield: '#2563eb', Volatility: '#7c3aed', Arbitrage: '#d97706', Stable: '#059669', 'Market Maker': '#0891b2' };
const stratBg: Record<string, string> = { Yield: '#eff6ff', Volatility: '#f5f3ff', Arbitrage: '#fffbeb', Stable: '#ecfdf5', 'Market Maker': '#ecfeff' };

function spark(base: number, len = 12) {
  return Array.from({ length: len }, (_, i) => ({ v: base * (0.85 + Math.random() * 0.3 + i * 0.01) }));
}

const AGENTS = [
  { id: 1001, name: 'Yield Harvester+', strategy: 'Yield',        apy: 87.3, sharpe: 1.94, winRate: 71.3, drawdown: 8.2,  tvl: 2.4, holders: 1247, price: 5.2,  rating: 4.9, reviews: 312, hot: true,  verified: true,  desc: 'Multi-pool DeFi yield optimizer across Aave, Curve, and Balancer. Auto-compounds every 24h.', minInvest: 100 },
  { id: 1002, name: 'Volatility Surge', strategy: 'Volatility',    apy: 76.1, sharpe: 1.67, winRate: 68.5, drawdown: 15.2, tvl: 1.8, holders: 892,  price: 3.8,  rating: 4.7, reviews: 198, hot: true,  verified: true,  desc: 'Momentum trading agent that rides ETH/BTC swings. Uses on-chain sentiment signals.', minInvest: 250 },
  { id: 1003, name: 'Arbitrage Master', strategy: 'Arbitrage',     apy: 72.8, sharpe: 1.52, winRate: 74.2, drawdown: 5.8,  tvl: 1.2, holders: 567,  price: 2.9,  rating: 4.8, reviews: 145, hot: false, verified: true,  desc: 'Cross-DEX arbitrage in milliseconds. Targets Uniswap V4, Curve, and Balancer discrepancies.', minInvest: 500 },
  { id: 1004, name: 'Stablecoin Pro',   strategy: 'Stable',        apy: 48.2, sharpe: 1.34, winRate: 89.1, drawdown: 2.1,  tvl: 3.2, holders: 2341, price: 4.1,  rating: 4.9, reviews: 567, hot: false, verified: true,  desc: 'Ultra-safe stablecoin yield optimizer. Only USDC/USDT/DAI — zero liquidation risk.', minInvest: 50 },
  { id: 1005, name: 'Market Maker Pro', strategy: 'Market Maker',  apy: 61.4, sharpe: 1.28, winRate: 63.2, drawdown: 9.1,  tvl: 0.92,holders: 345,  price: 2.1,  rating: 4.5, reviews: 89,  hot: false, verified: true,  desc: 'Provides concentrated liquidity on Uniswap V4 and earns swap fees on high-volume pairs.', minInvest: 200 },
  { id: 1006, name: 'Epsilon Core',     strategy: 'Yield',         apy: 95.0, sharpe: 2.01, winRate: 78.4, drawdown: 7.5,  tvl: 1.1, holders: 234,  price: 8.7,  rating: 4.6, reviews: 56,  hot: true,  verified: true,  desc: 'Gen-4 bred agent combining Yield Harvester + Stablecoin Pro genetics. 95% APY target.', minInvest: 1000 },
];

const REVIEWS = [
  { user: '0xTrader99', rating: 5, text: 'Up 45% in one month! Best agent I\'ve used.', time: '2h ago' },
  { user: 'CryptoSally', rating: 5, text: 'Consistent gains every week. Incredible team.', time: '5h ago' },
  { user: 'YieldHunter', rating: 4, text: 'Great stable yields. Would recommend to everyone.', time: '1d ago' },
];

function InvestModal({ agent, onClose }: { agent: typeof AGENTS[0]; onClose: () => void }) {
  const [amount, setAmount] = useState('1000');
  const projected = (parseFloat(amount || '0') * agent.apy / 100).toFixed(0);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal-box" style={{ padding: '2rem' }} onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Invest in {agent.name}</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{agent.strategy} · {agent.apy}% APY · Min ${agent.minInvest}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Deposit Amount (USDC)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" placeholder="Enter amount..." />
        </div>
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Projected Annual Yield</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>+${parseInt(projected).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Platform Fee</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>10% of profits</span>
          </div>
        </div>
        <button className="btn-primary" style={{ width: '100%', padding: '0.875rem', fontSize: '0.9rem' }}>
          Connect Wallet & Invest
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
          All trades verified by 0G Compute TEE · Withdraw anytime
        </p>
      </motion.div>
    </div>
  );
}

export default function MarketplacePanel() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'holders' | 'rating'>('apy');
  const [stratFilter, setStratFilter] = useState('All');
  const [selected, setSelected] = useState<typeof AGENTS[0] | null>(null);
  const [investAgent, setInvestAgent] = useState<typeof AGENTS[0] | null>(null);

  const filtered = AGENTS
    .filter(a => (stratFilter === 'All' || a.strategy === stratFilter) && (!search || a.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === 'apy' ? b.apy - a.apy : sortBy === 'tvl' ? b.tvl - a.tvl : sortBy === 'holders' ? b.holders - a.holders : b.rating - a.rating);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Agent Marketplace</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Discover, invest in, and trade high-performing AI agent iNFTs</p>
      </motion.div>

      {/* Market stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem' }}>
        {[
          { label: 'Listed Agents', val: '6', icon: '🤖' },
          { label: 'Avg APY', val: '73.5%', icon: '📈' },
          { label: 'Total TVL', val: '$10.6M', icon: '💰' },
          { label: 'Total Investors', val: '5,634', icon: '👥' },
        ].map((s, i) => (
          <div key={i} className="metric-card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{s.icon}</div>
            <div className="font-display" style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--accent-maroon)' }}>{s.val}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..." className="input-field" style={{ paddingLeft: '2.25rem', height: '38px' }} />
        </div>
        {['All', 'Yield', 'Volatility', 'Arbitrage', 'Stable', 'Market Maker'].map(s => (
          <button key={s} onClick={() => setStratFilter(s)} style={{
            padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none',
            background: stratFilter === s ? 'var(--accent-blue)' : 'var(--bg-elevated)',
            color: stratFilter === s ? '#fff' : 'var(--text-muted)',
          }}>{s}</button>
        ))}
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          style={{ padding: '0.3rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer' }}>
          <option value="apy">Sort: APY</option>
          <option value="tvl">Sort: TVL</option>
          <option value="holders">Sort: Holders</option>
          <option value="rating">Sort: Rating</option>
        </select>
      </div>

      {/* Agent grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(agent => (
          <motion.div key={agent.id} className="card" style={{ padding: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(15,23,42,0.12)' }}
            onClick={() => setSelected(selected?.id === agent.id ? null : agent)}
          >
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: stratColor[agent.strategy] || '#64748b' }} />

            {/* Hot badge */}
            {agent.hot && (
              <div style={{ position: 'absolute', top: '0.875rem', right: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '99px', background: '#fffbeb', border: '1px solid #fde68a', fontSize: '0.65rem', fontWeight: 700, color: '#d97706' }}>
                <Flame size={10} /> HOT
              </div>
            )}

            {/* Agent header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.875rem', paddingTop: '0.25rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#fff', background: stratColor[agent.strategy] || '#64748b', flexShrink: 0 }}>
                {agent.name[0]}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{agent.name}</span>
                  {agent.verified && <CheckCircle size={13} style={{ color: '#059669' }} />}
                </div>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700, background: stratBg[agent.strategy], color: stratColor[agent.strategy] }}>{agent.strategy}</span>
              </div>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '0.875rem' }}>
              {[
                { label: 'APY', val: `${agent.apy}%`, color: '#059669' },
                { label: 'Win Rate', val: `${agent.winRate}%`, color: 'var(--accent-maroon)' },
                { label: 'Sharpe', val: agent.sharpe.toFixed(2), color: 'var(--text-primary)' },
              ].map((m, i) => (
                <div key={i} style={{ background: 'var(--bg-elevated)', borderRadius: '8px', padding: '0.5rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: m.color, fontFamily: 'Outfit, sans-serif' }}>{m.val}</div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Users size={12} />
                {agent.holders.toLocaleString()} investors
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill={i < Math.floor(agent.rating) ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />
                ))}
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{agent.rating} ({agent.reviews})</span>
              </div>
            </div>

            {/* Sparkline */}
            <div style={{ height: 40, marginBottom: '0.875rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spark(agent.apy)}>
                  <Line type="monotone" dataKey="v" stroke={stratColor[agent.strategy]} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TVL</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>${agent.tvl}M</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Min Invest</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>${agent.minInvest}</div>
              </div>
              <button className="btn-primary" style={{ padding: '0.5rem 1.125rem', fontSize: '0.8rem' }}
                onClick={e => { e.stopPropagation(); setInvestAgent(agent); }}>
                Invest →
              </button>
            </div>

            {/* Expanded details */}
            <AnimatePresence>
              {selected?.id === agent.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-default)' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.6 }}>{agent.desc}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                    {[['Max Drawdown', `-${agent.drawdown}%`], ['Drawdown Risk', agent.drawdown < 10 ? 'Low' : 'Medium']].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Recent Reviews</p>
                    {REVIEWS.slice(0, 2).map((r, i) => (
                      <div key={i} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: 'var(--bg-elevated)', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.user}</span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{r.time}</span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {investAgent && <InvestModal agent={investAgent} onClose={() => setInvestAgent(null)} />}
    </div>
  );
}
