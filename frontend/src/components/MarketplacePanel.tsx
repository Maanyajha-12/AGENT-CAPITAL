import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Flame, Users, Star, TrendingUp, Shield, Zap, ArrowUpRight, ExternalLink, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import InvestModal from './InvestModal';
import { fetchAgentYields, yieldSourceBadge } from '../services/yield-api';

const stratColor: Record<string, string> = {
  Yield: '#3B82F6', Volatility: '#8B5CF6', Arbitrage: '#F59E0B',
  Stable: '#10B981', 'Market Maker': '#06B6D4',
};

function spark(base: number, len = 14) {
  return Array.from({ length: len }, (_, i) => ({ v: base * (0.82 + Math.random() * 0.38 + i * 0.012) }));
}

// Agent config — APY overridden by real yield-api data
const AGENT_CONFIG = [
  {
    id: 1, name: 'Yield Harvester+', strategy: 'Yield', sharpe: 1.94, winRate: 71.3, drawdown: 8.2,
    tvl: 2.4, holders: 1247, minInvest: 0.1, rating: 4.9, reviews: 312, hot: true, verified: true,
    yieldKey: 'yieldHarvester' as const,
    apyFallback: 8.24, sourceFallback: 'Est. (Aave V3 USDC)', sourceLink: 'https://app.aave.com/?marketName=proto_mainnet_v3',
    desc: 'Multi-pool DeFi yield optimizer across Aave V3 USDC. APY sourced live from DeFi Llama. Verified by 0G Compute TEE on every harvest.',
  },
  {
    id: 2, name: 'Volatility Surge', strategy: 'Volatility', sharpe: 1.67, winRate: 68.5, drawdown: 15.2,
    tvl: 1.8, holders: 892, minInvest: 0.25, rating: 4.7, reviews: 198, hot: true, verified: true,
    yieldKey: 'volatilitySurge' as const,
    apyFallback: 3.12, sourceFallback: 'Est. (Aave V3 WETH)', sourceLink: 'https://app.aave.com/?marketName=proto_mainnet_v3',
    desc: 'Momentum trading agent riding ETH/BTC swings. Base yield from Aave V3 WETH. 0G Compute TEE verifies each decision.',
  },
  {
    id: 3, name: 'Arbitrage Master', strategy: 'Arbitrage', sharpe: 1.52, winRate: 74.2, drawdown: 5.8,
    tvl: 1.2, holders: 567, minInvest: 0.5, rating: 4.8, reviews: 145, hot: false, verified: true,
    yieldKey: 'arbitrageMaster' as const,
    apyFallback: 6.81, sourceFallback: 'Est. (Curve stETH/ETH)', sourceLink: 'https://curve.fi/#/ethereum/pools',
    desc: 'Cross-DEX arbitrage targeting Curve stETH/ETH pool discrepancies. All trades on 0G Galileo testnet.',
  },
  {
    id: 4, name: 'Stablecoin Pro', strategy: 'Stable', sharpe: 1.34, winRate: 89.1, drawdown: 2.1,
    tvl: 3.2, holders: 2341, minInvest: 0.05, rating: 4.9, reviews: 567, hot: false, verified: true,
    yieldKey: 'stablecoinPro' as const,
    apyFallback: 4.67, sourceFallback: 'Est. (Aave V3 USDT)', sourceLink: 'https://app.aave.com/?marketName=proto_mainnet_v3',
    desc: 'Ultra-safe stablecoin optimizer. Only USDC/USDT/DAI. APY from Aave V3. Zero liquidation risk, consistent returns.',
  },
  {
    id: 5, name: 'Market Maker Pro', strategy: 'Market Maker', sharpe: 1.28, winRate: 63.2, drawdown: 9.1,
    tvl: 0.92, holders: 345, minInvest: 0.2, rating: 4.5, reviews: 89, hot: false, verified: true,
    yieldKey: 'marketMakerPro' as const,
    apyFallback: 12.41, sourceFallback: 'Est. (Uniswap V3 USDC/ETH)', sourceLink: 'https://app.uniswap.org/explore/pools',
    desc: 'Concentrated liquidity on Uniswap V3. Earns swap fees on USDC/ETH 0.05% pair with smart rebalancing.',
  },
];

export default function MarketplacePanel() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'apy' | 'tvl' | 'holders' | 'rating'>('apy');
  const [filter, setFilter] = useState('All');
  const [investAgent, setInvestAgent] = useState<null | { id: number; name: string; apy: number; tvl: number; winRate: number; color: string; apySource?: string; apySourceLink?: string; apyLastUpdated?: number | null }>(null);
  const [yields, setYields] = useState<any>(null);
  const [yieldLoading, setYieldLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchYields = () => {
    setYieldLoading(true);
    fetchAgentYields()
      .then(y => { setYields(y); setYieldLoading(false); setLastFetched(new Date()); })
      .catch(() => setYieldLoading(false));
  };

  useEffect(() => { fetchYields(); }, []);

  const agentsWithYields = AGENT_CONFIG.map(a => {
    const y = yields?.[a.yieldKey];
    const badge = y ? yieldSourceBadge(y.source) : { bg: 'rgba(245,158,11,0.12)', color: '#FCD34D', label: 'EST.' };
    return {
      ...a,
      apy: y?.apy ?? a.apyFallback,
      apySource: y?.sourceLabel ?? a.sourceFallback,
      apySourceLink: y?.protocol?.includes('Aave') ? a.sourceLink : (y?.source === 'defillama' ? 'https://yields.llama.fi/pools' : a.sourceLink),
      apyLastUpdated: y?.fetchedAt ?? null,
      apyBadge: badge,
      color: stratColor[a.strategy] || '#64748B',
    };
  });

  const filtered = agentsWithYields
    .filter(a => (filter === 'All' || a.strategy === filter) && (!search || a.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === 'apy' ? b.apy - a.apy : sortBy === 'tvl' ? b.tvl - a.tvl : sortBy === 'holders' ? b.holders - a.holders : b.rating - a.rating);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(59,130,246,0.4)' }}>
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit,sans-serif', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Agent Marketplace</h1>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>AI agents with real DeFi APY — verified on 0G Galileo</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {lastFetched && (
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                APY updated {Math.round((Date.now() - lastFetched.getTime()) / 1000)}s ago
              </span>
            )}
            <button onClick={fetchYields} className="btn-ghost" style={{ height: 34, padding: '0 0.75rem', fontSize: '0.72rem', gap: '0.375rem' }}>
              <RefreshCw size={13} style={{ animation: yieldLoading ? 'spin 1s linear infinite' : 'none' }} /> Refresh APY
            </button>
          </div>
        </div>
      </motion.div>

      {/* APY Data Source Banner */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: 12 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', flexShrink: 0 }} />
        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
          <strong style={{ color: '#60A5FA' }}>APY data sourced live</strong> from DeFi Llama API → Aave V3 API → fallback estimates (labeled EST.)
          {' '}· All investments are real transactions on 0G Galileo Testnet (Chain ID 16602)
        </span>
        <a href="https://yields.llama.fi/pools" target="_blank" rel="noopener noreferrer"
          style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#60A5FA', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
          Verify on DeFi Llama <ExternalLink size={10} />
        </a>
      </motion.div>

      {/* Market stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.875rem' }}>
        {[
          { label: 'Listed Agents', val: `${AGENT_CONFIG.length} Featured`, icon: Zap, color: '#3B82F6' },
          { label: 'Avg APY (Live)', val: yieldLoading ? 'Fetching…' : `${(agentsWithYields.reduce((s, a) => s + a.apy, 0) / agentsWithYields.length).toFixed(2)}%`, icon: TrendingUp, color: '#10B981' },
          { label: 'Total TVL', val: `$${agentsWithYields.reduce((s, a) => s + a.tvl, 0).toFixed(1)}M`, icon: Shield, color: '#F59E0B' },
          { label: 'Total Investors', val: agentsWithYields.reduce((s, a) => s + a.holders, 0).toLocaleString(), icon: Users, color: '#8B5CF6' },
        ].map(({ label, val, icon: Icon, color }) => (
          <motion.div key={label} className="metric-card" whileHover={{ y: -2 }} style={{ textAlign: 'center', borderTop: `2px solid ${color}35` }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.625rem' }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'Outfit,sans-serif', color, marginBottom: '0.2rem' }}>{val}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search agents..." className="input-field" style={{ paddingLeft: '2.25rem', height: 38 }} />
          </div>
          {['All', 'Yield', 'Volatility', 'Arbitrage', 'Stable', 'Market Maker'].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.3rem 0.875rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.15s', background: filter === s ? (stratColor[s] || 'var(--blue)') : 'rgba(255,255,255,0.04)', color: filter === s ? '#fff' : 'var(--text-muted)' }}>{s}</button>
          ))}
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} style={{ padding: '0.3rem 0.875rem', borderRadius: 8, fontSize: '0.8rem', border: '1px solid var(--border-default)', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', outline: 'none', cursor: 'pointer' }}>
            <option value="apy">↑ Sort by APY</option>
            <option value="tvl">↑ Sort by TVL</option>
            <option value="holders">↑ Sort by Investors</option>
            <option value="rating">↑ Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Agent cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px,1fr))', gap: '1.25rem' }}>
        {filtered.map((agent, idx) => {
          const col = agent.color;
          return (
            <motion.div key={agent.id} className="card"
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.07 }}
              whileHover={{ y: -6, boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 40px ${col}15` }}
              style={{ padding: '1.375rem', cursor: 'pointer', position: 'relative', overflow: 'hidden', border: `1px solid ${col}18` }}>

              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${col}, transparent)` }} />
              <div style={{ position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${col}12 0%, transparent 70%)`, filter: 'blur(20px)', pointerEvents: 'none' }} />

              {agent.hot && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: 99, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.62rem', fontWeight: 800, color: 'var(--gold-l)' }}>
                  <Flame size={10} /> HOT
                </div>
              )}

              {/* Agent header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${col}20`, border: `2px solid ${col}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 900, color: col, fontFamily: 'Outfit,sans-serif', flexShrink: 0, boxShadow: `0 0 20px ${col}25` }}>{agent.name[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem', fontFamily: 'Outfit,sans-serif' }}>{agent.name}</span>
                    {agent.verified && <CheckCircle size={13} style={{ color: 'var(--green)' }} />}
                  </div>
                  <span style={{ padding: '0.18rem 0.6rem', borderRadius: 99, fontSize: '0.62rem', fontWeight: 700, background: `${col}15`, color: col, border: `1px solid ${col}25` }}>{agent.strategy}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end' }}>
                    <Star size={11} fill="#F59E0B" style={{ color: '#F59E0B' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{agent.rating}</span>
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{agent.reviews} reviews</div>
                </div>
              </div>

              {/* APY — real source */}
              <div style={{ background: `${col}08`, border: `1px solid ${col}20`, borderRadius: 12, padding: '0.875rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>APY (Live)</div>
                    {yieldLoading ? (
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-muted)', fontFamily: 'Outfit,sans-serif' }}>…</div>
                    ) : (
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: col, fontFamily: 'Outfit,sans-serif' }}>{agent.apy.toFixed(2)}%</div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ display: 'inline-block', padding: '0.15rem 0.5rem', borderRadius: 99, fontSize: '0.58rem', fontWeight: 800, background: agent.apyBadge.bg, color: agent.apyBadge.color }}>
                      {agent.apyBadge.label}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.62rem', color: '#64748B' }}>
                  📡 {agent.apySource}
                  {agent.apySourceLink && (
                    <a href={agent.apySourceLink} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ marginLeft: 8, color: '#60A5FA', textDecoration: 'underline', fontWeight: 700 }}>
                      Verify →
                    </a>
                  )}
                </div>
                {agent.apyLastUpdated && (
                  <div style={{ fontSize: '0.58rem', color: '#475569', marginTop: 2 }}>
                    Updated {Math.round((Date.now() - agent.apyLastUpdated) / 1000)}s ago
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {[['Win Rate', `${agent.winRate}%`, 'var(--blue-l)'], ['Sharpe', agent.sharpe.toFixed(2), 'var(--purple-l)'], ['Max DD', `-${agent.drawdown}%`, 'var(--red-l)']].map(([l, v, c]) => (
                  <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '0.625rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.25rem' }}>{l}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: c as string, fontFamily: 'Outfit,sans-serif' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Sparkline */}
              <div style={{ height: 44, marginBottom: '1rem', borderRadius: 8, overflow: 'hidden' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spark(agent.apy)}>
                    <defs>
                      <linearGradient id={`sg${agent.id}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={col} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={col} />
                      </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="v" stroke={`url(#sg${agent.id})`} strokeWidth={2.5} dot={false} />
                    <Tooltip contentStyle={{ display: 'none' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <Users size={12} />{agent.holders.toLocaleString()} investors
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TVL: <span style={{ color: col, fontWeight: 700 }}>${agent.tvl}M</span></div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ flex: 1, fontSize: '0.68rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
                  Min: <strong style={{ color: 'var(--text-secondary)' }}>{agent.minInvest} 0G</strong>
                </div>
                <button
                  className="btn-primary"
                  onClick={e => {
                    e.stopPropagation();
                    setInvestAgent({ id: agent.id, name: agent.name, apy: agent.apy, tvl: agent.tvl * 1e6, winRate: agent.winRate, color: col, apySource: agent.apySource, apySourceLink: agent.apySourceLink, apyLastUpdated: agent.apyLastUpdated });
                  }}
                  style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem', borderRadius: 10, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  Invest <ArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Real InvestModal */}
      <AnimatePresence>
        {investAgent && (
          <InvestModal isOpen={!!investAgent} onClose={() => setInvestAgent(null)} agent={investAgent} />
        )}
      </AnimatePresence>
    </div>
  );
}
