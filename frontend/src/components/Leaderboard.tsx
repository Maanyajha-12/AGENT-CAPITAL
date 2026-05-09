import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowUpRight, ArrowDownRight, Flame, CheckCircle, Search, Star, Zap, Crown } from 'lucide-react';

const ALL_STRATS = ['All','Yield','Volatility','Arbitrage','Stable','Market Maker'];

const TOP3 = [
  { rank:1, name:'Yield Harvester+', strategy:'Yield',    apy:87.3, sharpe:1.94, drawdown:8.2,  tvl:2.4,  holders:1247, change:+4.2, color:'#F59E0B', badge:'👑 #1 RANKED' },
  { rank:2, name:'Volatility Surge',  strategy:'Volatility',apy:76.1, sharpe:1.67, drawdown:15.2, tvl:1.8,  holders:892,  change:-2.1, color:'#E2E8F0', badge:'🥈 TOP RATED' },
  { rank:3, name:'Arbitrage Master',  strategy:'Arbitrage', apy:72.8, sharpe:1.52, drawdown:5.8,  tvl:1.2,  holders:567,  change:+1.5, color:'#CD7C2F', badge:'🥉 ELITE' },
];

const AGENTS = [
  { rank:1,  name:'Yield Harvester+', strategy:'Yield',        apy:87.3, change:+4.2, sharpe:1.94, drawdown:8.2,  tvl:2.4,  holders:1247, verified:true, hot:true,  badge:'🔥 TRENDING', color:'#3B82F6' },
  { rank:2,  name:'Volatility Surge',  strategy:'Volatility',   apy:76.1, change:-2.1, sharpe:1.67, drawdown:15.2, tvl:1.8,  holders:892,  verified:true, hot:true,  badge:'💎 TOP RATED', color:'#8B5CF6' },
  { rank:3,  name:'Arbitrage Master',  strategy:'Arbitrage',    apy:72.8, change:+1.5, sharpe:1.52, drawdown:5.8,  tvl:1.2,  holders:567,  verified:true, hot:false, badge:'',            color:'#8B5CF6' },
  { rank:4,  name:'Stablecoin Pro',    strategy:'Stable',       apy:48.2, change:+0.3, sharpe:1.34, drawdown:2.1,  tvl:3.2,  holders:2341, verified:true, hot:false, badge:'⭐ SAFEST',   color:'#10B981' },
  { rank:5,  name:'Market Maker Pro',  strategy:'Market Maker', apy:61.4, change:-3.2, sharpe:1.28, drawdown:9.1,  tvl:0.92, holders:345,  verified:true, hot:false, badge:'',            color:'#06B6D4' },
  { rank:6,  name:'Epsilon Core',      strategy:'Yield',        apy:95.0, change:+6.1, sharpe:2.01, drawdown:7.5,  tvl:1.1,  holders:234,  verified:true, hot:true,  badge:'⚡ NEW',      color:'#EF4444' },
  { rank:7,  name:'DeFi Optimizer',    strategy:'Yield',        apy:56.2, change:+1.1, sharpe:1.08, drawdown:11.2, tvl:0.75, holders:321,  verified:true, hot:false, badge:'',            color:'#3B82F6' },
  { rank:8,  name:'Cross-Chain Vault', strategy:'Yield',        apy:54.8, change:+2.3, sharpe:1.14, drawdown:8.9,  tvl:0.89, holders:456,  verified:true, hot:false, badge:'',            color:'#10B981' },
  { rank:9,  name:'Delta Neutral',     strategy:'Arbitrage',    apy:52.3, change:+0.8, sharpe:0.98, drawdown:4.2,  tvl:0.67, holders:234,  verified:true, hot:false, badge:'',            color:'#F59E0B' },
  { rank:10, name:'Staking Elite',     strategy:'Stable',       apy:45.6, change:-0.5, sharpe:1.25, drawdown:1.8,  tvl:1.45, holders:789,  verified:true, hot:false, badge:'',            color:'#10B981' },
  ...Array.from({length:40},(_,i)=>({
    rank:11+i, name:`Agent #${1011+i}`, strategy:ALL_STRATS[1+(i%5)],
    apy:Math.round((35+Math.random()*30)*10)/10, change:parseFloat((Math.random()*6-3).toFixed(1)),
    sharpe:parseFloat((0.8+Math.random()*0.8).toFixed(2)), drawdown:parseFloat((2+Math.random()*18).toFixed(1)),
    tvl:parseFloat((0.1+Math.random()*0.8).toFixed(2)), holders:20+Math.floor(Math.random()*400),
    verified:Math.random()>0.25, hot:false, badge:'', color:'#64748B',
  })),
];

const stratColor: Record<string,string> = { Yield:'#3B82F6', Volatility:'#8B5CF6', Arbitrage:'#F59E0B', Stable:'#10B981', 'Market Maker':'#06B6D4' };

export default function Leaderboard() {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'apy'|'sharpe'|'tvl'|'holders'>('apy');
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);
  const [expandedRow, setExpandedRow] = useState<number|null>(null);

  useEffect(() => { const t = setInterval(()=>setTick(n=>n+1), 5000); return ()=>clearInterval(t); }, []);

  const filtered = AGENTS
    .filter(a => (filter==='All'||a.strategy===filter) && (!search||a.name.toLowerCase().includes(search.toLowerCase())))
    .sort((a,b) => sortBy==='apy'?b.apy-a.apy:sortBy==='sharpe'?b.sharpe-a.sharpe:sortBy==='tvl'?b.tvl-a.tvl:b.holders-a.holders);

  const stCol = (s:string) => stratColor[s]||'#64748B';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'0.25rem' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#F59E0B,#EF4444)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(245,158,11,0.4)' }}>
                <Trophy size={20} color="#fff" />
              </div>
              <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Agent Leaderboard</h1>
              <div style={{ display:'flex', alignItems:'center', gap:'0.375rem', padding:'0.25rem 0.75rem', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:99 }}>
                <div className="live-dot" style={{ width:6, height:6, background:'var(--green)' }} />
                <span style={{ fontSize:'0.65rem', fontWeight:800, color:'var(--green-l)', letterSpacing:'0.08em' }}>LIVE</span>
              </div>
            </div>
            <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>500+ AI trading agents ranked by performance · auto-refreshing every 5s</p>
          </div>
        </div>

        {/* Platform stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.875rem' }}>
          {[['Total Agents','500+','#3B82F6'],['Total TVL','$84.2M','#10B981'],['Avg APY','60.2%','#F59E0B'],['Investors','12,467','#8B5CF6']].map(([l,v,c]) => (
            <div key={l} className="card" style={{ padding:'1rem 1.25rem', textAlign:'center', borderTop:`2px solid ${c}35` }}>
              <div style={{ fontSize:'0.6rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--text-muted)', marginBottom:'0.375rem' }}>{l}</div>
              <div style={{ fontSize:'1.5rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:c as string }}>{v}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* TOP 3 Podium */}
      <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <h2 style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'1rem' }}>🏆 Top Performers</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr 1fr', gap:'1rem', alignItems:'end' }}>
          {[TOP3[1], TOP3[0], TOP3[2]].map((a,i) => {
            const isFirst = a.rank===1;
            const heights = [240, 280, 220];
            return (
              <motion.div key={a.rank} whileHover={{ y:-4, scale:1.01 }}
                style={{ height:heights[i], padding:'1.5rem', borderRadius:'var(--r-2xl)', border:`1px solid ${a.color}35`, background:`linear-gradient(135deg, rgba(13,17,23,0.95), rgba(22,29,44,0.9))`, boxShadow:`0 0 40px ${a.color}15`, display:'flex', flexDirection:'column', justifyContent:'space-between', cursor:'pointer', position:'relative', overflow:'hidden', transition:'all 0.25s' }}>
                {/* Glow top */}
                <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${a.color}, transparent)` }} />
                <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:'50%', background:`radial-gradient(circle, ${a.color}15 0%, transparent 70%)`, filter:'blur(20px)' }} />

                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div style={{ fontSize:'0.65rem', fontWeight:800, padding:'0.25rem 0.625rem', borderRadius:99, background:`${a.color}15`, color:a.color, border:`1px solid ${a.color}30` }}>{a.badge}</div>
                  {isFirst && <Crown size={22} style={{ color:'#F59E0B' }} />}
                </div>

                <div>
                  <div style={{ width:48, height:48, borderRadius:14, background:`${a.color}18`, border:`2px solid ${a.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:900, color:a.color, fontFamily:'Outfit,sans-serif', marginBottom:'0.75rem', boxShadow:`0 0 20px ${a.color}25` }}>{a.rank}</div>
                  <div style={{ fontSize:'1rem', fontWeight:900, color:'var(--text-primary)', fontFamily:'Outfit,sans-serif', marginBottom:'0.2rem' }}>{a.name}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1rem' }}>{a.strategy}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'0.375rem' }}>
                    <span style={{ fontSize:'2rem', fontWeight:900, color:a.color, fontFamily:'Outfit,sans-serif', lineHeight:1 }}>{a.apy}%</span>
                    <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>APY</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginTop:'0.75rem' }}>
                    {[['TVL',`$${a.tvl}M`],['Sharpe',a.sharpe]].map(([lbl,val])=>(
                      <div key={lbl as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'0.4rem 0.5rem' }}>
                        <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{lbl}</div>
                        <div style={{ fontSize:'0.875rem', fontWeight:800, color:'var(--text-primary)', fontFamily:'Outfit,sans-serif' }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="card" style={{ padding:'1rem 1.25rem' }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.75rem', alignItems:'center' }}>
          <div style={{ position:'relative', flex:'1 1 200px' }}>
            <Search size={14} style={{ position:'absolute', left:'0.75rem', top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search agents..." className="input-field" style={{ paddingLeft:'2.25rem', height:36, fontSize:'0.825rem' }} />
          </div>
          <div style={{ display:'flex', gap:'0.375rem', flexWrap:'wrap' }}>
            {ALL_STRATS.map(s => (
              <button key={s} onClick={()=>setFilter(s)}
                style={{ padding:'0.3rem 0.875rem', borderRadius:99, fontSize:'0.72rem', fontWeight:700, cursor:'pointer', border:'none', transition:'all 0.15s',
                  background:filter===s?stCol(s)||'var(--blue)':'rgba(255,255,255,0.04)',
                  color:filter===s?'#fff':'var(--text-muted)' }}>{s}</button>
            ))}
          </div>
          <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)}
            style={{ padding:'0.3rem 0.875rem', borderRadius:8, fontSize:'0.8rem', border:'1px solid var(--border-default)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', cursor:'pointer', outline:'none' }}>
            <option value="apy">Sort: APY</option>
            <option value="sharpe">Sort: Sharpe</option>
            <option value="tvl">Sort: TVL</option>
            <option value="holders">Sort: Holders</option>
          </select>
        </div>
        <p style={{ fontSize:'0.68rem', color:'var(--text-dim)', marginTop:'0.625rem' }}>Showing {filtered.length} agents · Auto-refreshing</p>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }} className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="table-dark" style={{ minWidth:900 }}>
            <thead>
              <tr>
                <th style={{ width:52 }}>#</th>
                <th>Agent</th>
                <th>Strategy</th>
                <th style={{ textAlign:'right' }}>APY</th>
                <th style={{ textAlign:'right' }}>24h Δ</th>
                <th style={{ textAlign:'right' }}>Sharpe</th>
                <th style={{ textAlign:'right' }}>Drawdown</th>
                <th style={{ textAlign:'right' }}>TVL</th>
                <th style={{ textAlign:'right' }}>Holders</th>
                <th style={{ textAlign:'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0,50).map((a,idx) => {
                const medals = ['🥇','🥈','🥉'];
                return (
                  <React.Fragment key={a.rank}>
                    <motion.tr initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.012 }}
                      onClick={()=>setExpandedRow(expandedRow===a.rank?null:a.rank)}
                      style={{ cursor:'pointer', borderLeft:expandedRow===a.rank?`3px solid ${a.color}`:'3px solid transparent', transition:'all 0.15s' }}>
                      <td>
                        {a.rank<=3 ? <span style={{ fontSize:'1.1rem' }}>{medals[a.rank-1]}</span>
                          : <span style={{ fontWeight:700, color:'var(--text-dim)', fontFamily:'Outfit,sans-serif' }}>{a.rank}</span>}
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                          <div style={{ width:32, height:32, borderRadius:9, background:`${a.color}18`, border:`1px solid ${a.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:900, color:a.color, fontFamily:'Outfit,sans-serif', flexShrink:0 }}>{a.rank}</div>
                          <div>
                            <div style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
                              <span style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'0.875rem' }}>{a.name}</span>
                              {a.verified && <CheckCircle size={12} style={{ color:'#10B981' }} />}
                              {a.hot && <Flame size={12} style={{ color:'#F59E0B' }} />}
                            </div>
                            {a.badge && <span style={{ fontSize:'0.58rem', fontWeight:700, padding:'0.08rem 0.4rem', borderRadius:99, background:'rgba(245,158,11,0.12)', color:'var(--gold-l)' }}>{a.badge}</span>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ padding:'0.2rem 0.625rem', borderRadius:99, fontSize:'0.68rem', fontWeight:700, background:`${stCol(a.strategy)}15`, color:stCol(a.strategy), border:`1px solid ${stCol(a.strategy)}25` }}>{a.strategy}</span>
                      </td>
                      <td style={{ textAlign:'right' }}>
                        <span style={{ fontWeight:900, color:'var(--green-l)', fontSize:'1rem', fontFamily:'Outfit,sans-serif' }}>{a.apy.toFixed(1)}%</span>
                      </td>
                      <td style={{ textAlign:'right' }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.2rem' }}>
                          {a.change>0 ? <ArrowUpRight size={13} style={{ color:'var(--green-l)' }} /> : <ArrowDownRight size={13} style={{ color:'var(--red-l)' }} />}
                          <span style={{ fontSize:'0.8rem', fontWeight:700, color:a.change>0?'var(--green-l)':'var(--red-l)' }}>{a.change>0?'+':''}{a.change}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign:'right', fontWeight:700, color:'var(--text-secondary)' }}>{a.sharpe}</td>
                      <td style={{ textAlign:'right', fontWeight:700, color:a.drawdown<5?'var(--green-l)':a.drawdown<12?'var(--gold-l)':'var(--red-l)' }}>-{a.drawdown}%</td>
                      <td style={{ textAlign:'right', fontWeight:700, color:'var(--text-secondary)' }}>${a.tvl}M</td>
                      <td style={{ textAlign:'right', fontWeight:700, color:'var(--text-secondary)' }}>{a.holders.toLocaleString()}</td>
                      <td style={{ textAlign:'center' }}>
                        <button className="btn-primary" style={{ padding:'0.3rem 0.875rem', fontSize:'0.72rem', height:28, borderRadius:8 }}
                          onClick={e=>{ e.stopPropagation(); }}>Invest</button>
                      </td>
                    </motion.tr>
                    <AnimatePresence>
                      {expandedRow===a.rank && (
                        <tr>
                          <td colSpan={10} style={{ padding:0, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
                              style={{ padding:'0.875rem 1.25rem', background:`${a.color}05`, display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'1rem' }}>
                              {[['Win Rate','71.3%'],['Max Drawdown',`-${a.drawdown}%`],['Sharpe',a.sharpe],['TVL',`$${a.tvl}M`],['Investors',a.holders]].map(([k,v])=>(
                                <div key={k as string}>
                                  <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.2rem' }}>{k}</div>
                                  <div style={{ fontSize:'0.95rem', fontWeight:800, color:a.color, fontFamily:'Outfit,sans-serif' }}>{v}</div>
                                </div>
                              ))}
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding:'0.875rem 1.25rem', borderTop:'1px solid var(--border-dim)', background:'rgba(255,255,255,0.01)', fontSize:'0.72rem', color:'var(--text-dim)', textAlign:'center', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
          <div className="live-dot" style={{ width:5, height:5, background:'var(--green)' }} />
          Showing top 50 of {filtered.length} agents · Click row to expand · Updates every 5s
        </div>
      </motion.div>
    </div>
  );
}
