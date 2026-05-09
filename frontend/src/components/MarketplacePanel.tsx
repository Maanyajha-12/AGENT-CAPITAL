import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, Flame, Users, X, Star, TrendingUp, Shield, Zap, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

const stratColor: Record<string,string> = { Yield:'#3B82F6', Volatility:'#8B5CF6', Arbitrage:'#F59E0B', Stable:'#10B981', 'Market Maker':'#06B6D4' };

function spark(base:number,len=14) {
  return Array.from({length:len},(_,i)=>({ v:base*(0.82+Math.random()*0.38+i*0.012) }));
}

const AGENTS = [
  { id:1001, name:'Yield Harvester+', strategy:'Yield',       apy:87.3, sharpe:1.94, winRate:71.3, drawdown:8.2,  tvl:2.4,  holders:1247, minInvest:100,  rating:4.9, reviews:312, hot:true,  verified:true, desc:'Multi-pool DeFi yield optimizer across Aave, Curve, and Balancer. Auto-compounds every 24h with gas-optimized execution.' },
  { id:1002, name:'Volatility Surge',  strategy:'Volatility',  apy:76.1, sharpe:1.67, winRate:68.5, drawdown:15.2, tvl:1.8,  holders:892,  minInvest:250,  rating:4.7, reviews:198, hot:true,  verified:true, desc:'Momentum trading agent that rides ETH/BTC swings. Uses on-chain sentiment signals and funding rates.' },
  { id:1003, name:'Arbitrage Master',  strategy:'Arbitrage',   apy:72.8, sharpe:1.52, winRate:74.2, drawdown:5.8,  tvl:1.2,  holders:567,  minInvest:500,  rating:4.8, reviews:145, hot:false, verified:true, desc:'Cross-DEX arbitrage in milliseconds. Targets Uniswap V4, Curve, and Balancer price discrepancies.' },
  { id:1004, name:'Stablecoin Pro',    strategy:'Stable',      apy:48.2, sharpe:1.34, winRate:89.1, drawdown:2.1,  tvl:3.2,  holders:2341, minInvest:50,   rating:4.9, reviews:567, hot:false, verified:true, desc:'Ultra-safe stablecoin yield optimizer. Only USDC/USDT/DAI — zero liquidation risk, consistent returns.' },
  { id:1005, name:'Market Maker Pro',  strategy:'Market Maker',apy:61.4, sharpe:1.28, winRate:63.2, drawdown:9.1,  tvl:0.92, holders:345,  minInvest:200,  rating:4.5, reviews:89,  hot:false, verified:true, desc:'Provides concentrated liquidity on Uniswap V4. Earns swap fees on high-volume pairs with smart rebalancing.' },
  { id:1006, name:'Epsilon Core',      strategy:'Yield',       apy:95.0, sharpe:2.01, winRate:78.4, drawdown:7.5,  tvl:1.1,  holders:234,  minInvest:1000, rating:4.6, reviews:56,  hot:true,  verified:true, desc:'Gen-4 bred agent combining Yield Harvester + Stablecoin Pro genetics. Highest APY with institutional-grade risk controls.' },
];

function InvestModal({ agent, onClose }: { agent:typeof AGENTS[0]; onClose:()=>void }) {
  const [amount, setAmount] = useState('1000');
  const projected = (parseFloat(amount||'0') * agent.apy / 100).toFixed(0);
  const col = stratColor[agent.strategy]||'#3B82F6';
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal-box" onClick={e=>e.stopPropagation()} initial={{ opacity:0, scale:0.94, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.96 }} transition={{ type:'spring', stiffness:400, damping:30 }}>
        <div style={{ padding:'1.75rem' }}>
          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${col}20`, border:`2px solid ${col}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', fontWeight:900, color:col, fontFamily:'Outfit,sans-serif', boxShadow:`0 0 20px ${col}30` }}>{agent.name[0]}</div>
              <div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:800, color:'var(--text-primary)', fontFamily:'Outfit,sans-serif' }}>Invest in {agent.name}</h3>
                <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{agent.strategy} · {agent.apy}% APY · Min ${agent.minInvest}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:'0.25rem' }}><X size={20} /></button>
          </div>

          {/* Quick stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
            {[['APY',`${agent.apy}%`,col],['Win Rate',`${agent.winRate}%`,'var(--blue-l)'],['Max Drawdown',`-${agent.drawdown}%`,'var(--red-l)']].map(([l,v,c])=>(
              <div key={l} style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:'0.875rem', textAlign:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.3rem' }}>{l}</div>
                <div style={{ fontSize:'1.25rem', fontWeight:900, color:c as string, fontFamily:'Outfit,sans-serif' }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Amount input */}
          <div style={{ marginBottom:'1.25rem' }}>
            <label style={{ display:'block', fontSize:'0.8rem', fontWeight:700, color:'var(--text-secondary)', marginBottom:'0.5rem' }}>Deposit Amount (USDC)</label>
            <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="input-field" placeholder="Enter amount..." style={{ fontSize:'1rem', height:48, fontFamily:'Outfit,sans-serif', fontWeight:700 }} />
          </div>

          {/* Projection */}
          <div style={{ background:`${col}08`, border:`1px solid ${col}20`, borderRadius:14, padding:'1.125rem', marginBottom:'1.5rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.5rem' }}>
              <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Projected Annual Yield</span>
              <span style={{ fontSize:'1.25rem', fontWeight:900, color:'var(--green-l)', fontFamily:'Outfit,sans-serif' }}>+${parseInt(projected).toLocaleString()}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Platform Fee</span>
              <span style={{ fontSize:'0.78rem', color:'var(--text-secondary)', fontWeight:600 }}>10% of profits only</span>
            </div>
          </div>

          <button className="btn-primary" style={{ width:'100%', height:52, fontSize:'0.95rem', borderRadius:'var(--r-lg)' }}>
            <Zap size={16} /> Connect Wallet & Invest
          </button>
          <p style={{ textAlign:'center', fontSize:'0.65rem', color:'var(--text-dim)', marginTop:'0.75rem' }}>
            All trades verified by 0G Compute TEE · Withdraw anytime · No lock-in
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function MarketplacePanel() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'apy'|'tvl'|'holders'|'rating'>('apy');
  const [filter, setFilter] = useState('All');
  const [investAgent, setInvestAgent] = useState<typeof AGENTS[0]|null>(null);

  const filtered = AGENTS
    .filter(a=>(filter==='All'||a.strategy===filter)&&(!search||a.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b)=>sortBy==='apy'?b.apy-a.apy:sortBy==='tvl'?b.tvl-a.tvl:sortBy==='holders'?b.holders-a.holders:b.rating-a.rating);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'0.3rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#3B82F6,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(59,130,246,0.4)' }}>
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Agent Marketplace</h1>
            <p style={{ fontSize:'0.825rem', color:'var(--text-muted)' }}>App Store for autonomous AI hedge funds</p>
          </div>
        </div>
      </motion.div>

      {/* Market stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.875rem' }}>
        {[
          { label:'Listed Agents', val:'500+', icon:Zap, color:'#3B82F6' },
          { label:'Avg APY', val:'73.5%', icon:TrendingUp, color:'#10B981' },
          { label:'Total TVL', val:'$10.6M', icon:Shield, color:'#F59E0B' },
          { label:'Total Investors', val:'5,634', icon:Users, color:'#8B5CF6' },
        ].map(({label,val,icon:Icon,color})=>(
          <motion.div key={label} className="metric-card" whileHover={{ y:-2 }} style={{ textAlign:'center', borderTop:`2px solid ${color}35` }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.625rem' }}>
              <Icon size={16} style={{ color }} />
            </div>
            <div style={{ fontSize:'1.5rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color, marginBottom:'0.2rem' }}>{val}</div>
            <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="card" style={{ padding:'1rem 1.25rem' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1 1 220px' }}>
            <Search size={14} style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agents..." className="input-field" style={{ paddingLeft:'2.25rem', height:38 }} />
          </div>
          {['All','Yield','Volatility','Arbitrage','Stable','Market Maker'].map(s=>(
            <button key={s} onClick={()=>setFilter(s)} style={{ padding:'0.3rem 0.875rem', borderRadius:99, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', border:'none', transition:'all 0.15s', background:filter===s?(stratColor[s]||'var(--blue)'):'rgba(255,255,255,0.04)', color:filter===s?'#fff':'var(--text-muted)' }}>{s}</button>
          ))}
          <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} style={{ padding:'0.3rem 0.875rem', borderRadius:8, fontSize:'0.8rem', border:'1px solid var(--border-default)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', outline:'none', cursor:'pointer' }}>
            <option value="apy">↑ Sort by APY</option>
            <option value="tvl">↑ Sort by TVL</option>
            <option value="holders">↑ Sort by Investors</option>
            <option value="rating">↑ Sort by Rating</option>
          </select>
        </div>
      </div>

      {/* Agent cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px,1fr))', gap:'1.25rem' }}>
        {filtered.map((agent,idx)=>{
          const col = stratColor[agent.strategy]||'#64748B';
          return (
            <motion.div key={agent.id} className="card"
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.07 }}
              whileHover={{ y:-6, boxShadow:`0 24px 48px rgba(0,0,0,0.6), 0 0 40px ${col}15` }}
              style={{ padding:'1.375rem', cursor:'pointer', position:'relative', overflow:'hidden', border:`1px solid ${col}18` }}>

              {/* Gradient top accent */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${col}, transparent)` }} />
              {/* Subtle bg glow */}
              <div style={{ position:'absolute', top:-40, right:-40, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle, ${col}12 0%, transparent 70%)`, filter:'blur(20px)', pointerEvents:'none' }} />

              {/* Hot badge */}
              {agent.hot && (
                <div style={{ position:'absolute', top:'1rem', right:'1rem', display:'flex', alignItems:'center', gap:'0.25rem', padding:'0.2rem 0.5rem', borderRadius:99, background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.25)', fontSize:'0.62rem', fontWeight:800, color:'var(--gold-l)' }}>
                  <Flame size={10} /> HOT
                </div>
              )}

              {/* Agent header */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'1rem' }}>
                <div style={{ width:48, height:48, borderRadius:14, background:`${col}20`, border:`2px solid ${col}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:900, color:col, fontFamily:'Outfit,sans-serif', flexShrink:0, boxShadow:`0 0 20px ${col}25` }}>{agent.name[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.25rem' }}>
                    <span style={{ fontWeight:800, color:'var(--text-primary)', fontSize:'0.95rem', fontFamily:'Outfit,sans-serif' }}>{agent.name}</span>
                    {agent.verified && <CheckCircle size={13} style={{ color:'var(--green)' }} />}
                  </div>
                  <span style={{ padding:'0.18rem 0.6rem', borderRadius:99, fontSize:'0.62rem', fontWeight:700, background:`${col}15`, color:col, border:`1px solid ${col}25` }}>{agent.strategy}</span>
                </div>
                {/* Rating */}
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.2rem', justifyContent:'flex-end' }}>
                    <Star size={11} fill="#F59E0B" style={{ color:'#F59E0B' }} />
                    <span style={{ fontSize:'0.8rem', fontWeight:800, color:'var(--text-primary)' }}>{agent.rating}</span>
                  </div>
                  <div style={{ fontSize:'0.62rem', color:'var(--text-muted)' }}>{agent.reviews} reviews</div>
                </div>
              </div>

              {/* Metrics */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginBottom:'1rem' }}>
                {[['APY',`${agent.apy}%`,col],['Win Rate',`${agent.winRate}%`,'var(--blue-l)'],['Sharpe',agent.sharpe.toFixed(2),'var(--purple-l)']].map(([l,v,c])=>(
                  <div key={l} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'0.625rem', textAlign:'center', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.25rem' }}>{l}</div>
                    <div style={{ fontSize:'1.05rem', fontWeight:900, color:c as string, fontFamily:'Outfit,sans-serif' }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Sparkline */}
              <div style={{ height:44, marginBottom:'1rem', borderRadius:8, overflow:'hidden' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spark(agent.apy)}>
                    <defs>
                      <linearGradient id={`sg${agent.id}`} x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={col} stopOpacity={0.4} />
                        <stop offset="100%" stopColor={col} />
                      </linearGradient>
                    </defs>
                    <Line type="monotone" dataKey="v" stroke={`url(#sg${agent.id})`} strokeWidth={2.5} dot={false} />
                    <Tooltip contentStyle={{ display:'none' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Social + Footer */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.875rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontSize:'0.72rem', color:'var(--text-muted)' }}>
                  <Users size={12} />{agent.holders.toLocaleString()} investors
                </div>
                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Max DD: <span style={{ color:'var(--red-l)', fontWeight:700 }}>-{agent.drawdown}%</span></div>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'0.6rem', color:'var(--text-dim)' }}>TVL</div>
                  <div style={{ fontWeight:800, color:'var(--text-primary)', fontSize:'0.95rem', fontFamily:'Outfit,sans-serif' }}>${agent.tvl}M</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'0.6rem', color:'var(--text-dim)' }}>Min Invest</div>
                  <div style={{ fontWeight:800, color:'var(--text-primary)', fontSize:'0.95rem', fontFamily:'Outfit,sans-serif' }}>${agent.minInvest}</div>
                </div>
                <button className="btn-green" onClick={e=>{ e.stopPropagation(); setInvestAgent(agent); }}
                  style={{ padding:'0.6rem 1.25rem', fontSize:'0.8rem', borderRadius:10, whiteSpace:'nowrap' }}>
                  Invest <ArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>{investAgent && <InvestModal agent={investAgent} onClose={()=>setInvestAgent(null)} />}</AnimatePresence>
    </div>
  );
}
