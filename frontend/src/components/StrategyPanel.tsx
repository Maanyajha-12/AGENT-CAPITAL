import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, TrendingUp, Shield, ArrowUpRight, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STRATEGIES = [
  { id:1, name:'Yield Farming', color:'#3B82F6', apy:87.3, sharpe:1.94, winRate:71.3, drawdown:8.2, agents:127, minTVL:'$100', risk:'Medium', desc:'Multi-protocol yield optimization across Aave, Curve, Balancer, and Yearn. Auto-compounds every 24h with gas-optimized execution on 0G Compute.', protocols:['Aave V3','Curve Finance','Balancer V2','Yearn Vaults'], chains:['Ethereum','Arbitrum','0G Chain'], chart:[60,72,68,80,85,90,87,95,88,92,96,87] },
  { id:2, name:'Volatility Trading', color:'#8B5CF6', apy:76.1, sharpe:1.67, winRate:68.5, drawdown:15.2, agents:98, minTVL:'$250', risk:'High', desc:'Momentum-based ETH/BTC trading using on-chain sentiment, funding rates, and order flow. 0G TEE verified execution.', protocols:['GMX','dYdX','Perp Protocol'], chains:['Arbitrum','Base'], chart:[55,62,70,65,75,80,72,85,78,82,76,80] },
  { id:3, name:'Arbitrage', color:'#F59E0B', apy:72.8, sharpe:1.52, winRate:74.2, drawdown:5.8, agents:76, minTVL:'$500', risk:'Low', desc:'Cross-DEX and cross-chain arbitrage capturing price discrepancies in milliseconds across Uniswap, Curve, and Balancer.', protocols:['Uniswap V4','Curve','Balancer'], chains:['Ethereum','Polygon','Arbitrum'], chart:[50,58,65,70,68,75,73,78,72,76,74,72] },
  { id:4, name:'Stable Yield', color:'#10B981', apy:48.2, sharpe:1.34, winRate:89.1, drawdown:2.1, agents:145, minTVL:'$50', risk:'Very Low', desc:'Ultra-safe stablecoin optimization. Only USDC/USDT/DAI — zero liquidation risk. Consistent 40-55% APY every month.', protocols:['Aave V3','Compound V3','Sky Protocol'], chains:['Ethereum','Polygon','Base'], chart:[42,44,46,45,47,49,48,50,49,48,48,48] },
  { id:5, name:'Market Making', color:'#06B6D4', apy:61.4, sharpe:1.28, winRate:63.2, drawdown:9.1, agents:54, minTVL:'$200', risk:'Medium', desc:'Concentrated liquidity provision on Uniswap V4. Earns swap fees on high-volume pairs with smart range rebalancing.', protocols:['Uniswap V4','Ambient Finance'], chains:['Ethereum','Base'], chart:[52,56,60,58,62,65,63,66,61,64,62,61] },
];

const riskColor: Record<string,string> = { 'Very Low':'#10B981', Low:'#34D399', Medium:'#F59E0B', High:'#EF4444' };

function InvestModal({ s, onClose }: { s: typeof STRATEGIES[0]; onClose: ()=>void }) {
  const [amount, setAmount] = useState('1000');
  const projected = Math.round(parseFloat(amount||'0') * s.apy / 100);
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <motion.div initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9 }} onClick={e=>e.stopPropagation()}
        style={{ background:'linear-gradient(135deg,rgba(13,17,23,0.99),rgba(22,29,44,0.99))', border:`1px solid ${s.color}30`, borderRadius:24, width:'100%', maxWidth:500, padding:'2rem', boxShadow:`0 40px 80px rgba(0,0,0,0.7), 0 0 60px ${s.color}10` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
          <div>
            <h2 style={{ fontSize:'1.25rem', fontWeight:900, color:'#F8FAFC', fontFamily:'Outfit,sans-serif' }}>Invest in {s.name}</h2>
            <p style={{ fontSize:'0.75rem', color:'#64748B', marginTop:'0.2rem' }}>{s.risk} Risk · Min {s.minTVL}</p>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'0.5rem', cursor:'pointer', color:'#64748B' }}><X size={16}/></button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {[['APY',`${s.apy}%`,s.color],['Sharpe',s.sharpe,'#3B82F6'],['Win Rate',`${s.winRate}%`,'#10B981']].map(([l,v,c])=>(
            <div key={l as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:'0.875rem', textAlign:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize:'0.6rem', color:'#64748B', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.3rem' }}>{l}</div>
              <div style={{ fontSize:'1.375rem', fontWeight:900, color:c as string, fontFamily:'Outfit,sans-serif' }}>{v}</div>
            </div>
          ))}
        </div>
        <label style={{ display:'block', fontSize:'0.8rem', fontWeight:700, color:'#94A3B8', marginBottom:'0.5rem' }}>Deposit Amount (USDC)</label>
        <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount..."
          style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:`1px solid ${s.color}30`, borderRadius:12, color:'#F8FAFC', fontSize:'1.1rem', fontWeight:700, fontFamily:'Outfit,sans-serif', padding:'0.875rem 1rem', outline:'none', marginBottom:'1rem' }} />
        <div style={{ background:`${s.color}08`, border:`1px solid ${s.color}20`, borderRadius:14, padding:'1.125rem', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.375rem' }}>
            <span style={{ fontSize:'0.8rem', color:'#64748B' }}>Projected Annual Yield</span>
            <span style={{ fontSize:'1.375rem', fontWeight:900, color:'#34D399', fontFamily:'Outfit,sans-serif' }}>+${projected.toLocaleString()}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:'0.75rem', color:'#64748B' }}>Platform Fee</span>
            <span style={{ fontSize:'0.75rem', color:'#94A3B8', fontWeight:600 }}>10% of profits only</span>
          </div>
        </div>
        <button style={{ width:'100%', height:52, borderRadius:14, border:'none', cursor:'pointer', background:`linear-gradient(135deg, ${s.color}, ${s.color}bb)`, color:'#fff', fontSize:'1rem', fontWeight:800, fontFamily:'Outfit,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', boxShadow:`0 0 30px ${s.color}40` }}>
          <Zap size={18}/> Connect Wallet & Invest
        </button>
        <p style={{ textAlign:'center', fontSize:'0.65rem', color:'#334155', marginTop:'0.75rem' }}>Every trade verified by 0G Compute TEE · Withdraw anytime</p>
      </motion.div>
    </motion.div>
  );
}

function DetailsModal({ s, onClose }: { s: typeof STRATEGIES[0]; onClose: ()=>void }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(12px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', overflowY:'auto' }}>
      <motion.div initial={{ scale:0.9, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.9 }} onClick={e=>e.stopPropagation()}
        style={{ background:'linear-gradient(135deg,rgba(13,17,23,0.99),rgba(22,29,44,0.99))', border:`1px solid ${s.color}30`, borderRadius:24, width:'100%', maxWidth:640, padding:'2rem', boxShadow:`0 40px 80px rgba(0,0,0,0.7)` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`${s.color}20`, border:`2px solid ${s.color}40`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 24px ${s.color}30` }}>
              <div style={{ width:12, height:12, borderRadius:'50%', background:s.color }}/>
            </div>
            <div>
              <h2 style={{ fontSize:'1.375rem', fontWeight:900, color:'#F8FAFC', fontFamily:'Outfit,sans-serif' }}>{s.name}</h2>
              <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:99, background:`${riskColor[s.risk]}15`, color:riskColor[s.risk], border:`1px solid ${riskColor[s.risk]}25` }}>{s.risk} Risk</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'0.5rem', cursor:'pointer', color:'#64748B' }}><X size={16}/></button>
        </div>
        <p style={{ fontSize:'0.875rem', color:'#94A3B8', lineHeight:1.8, marginBottom:'1.5rem' }}>{s.desc}</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.75rem', marginBottom:'1.5rem' }}>
          {[['APY',`${s.apy}%`,s.color],['Sharpe',s.sharpe,'#3B82F6'],['Win Rate',`${s.winRate}%`,'#10B981'],['Max DD',`-${s.drawdown}%`,'#EF4444']].map(([l,v,c])=>(
            <div key={l as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:'0.875rem', textAlign:'center', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize:'0.58rem', color:'#64748B', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.3rem' }}>{l}</div>
              <div style={{ fontSize:'1.125rem', fontWeight:900, color:c as string, fontFamily:'Outfit,sans-serif' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ height:160, marginBottom:'1.5rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={s.chart.map((v,i)=>({i,v}))}>
              <defs><linearGradient id="dm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={s.color} stopOpacity={0.3}/><stop offset="95%" stopColor={s.color} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
              <XAxis dataKey="i" tick={{ fontSize:10, fill:'#475569' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:'#475569' }} axisLine={false} tickLine={false} unit="%"/>
              <Tooltip contentStyle={{ background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10 }} formatter={(v:any)=>[`${v.toFixed(1)}%`,'APY']}/>
              <Area type="monotone" dataKey="v" stroke={s.color} strokeWidth={2.5} fill="url(#dm)" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
          <div>
            <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.625rem' }}>Protocols</p>
            {s.protocols.map(p=>(
              <div key={p} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.375rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <CheckCircle size={12} style={{ color:s.color }}/><span style={{ fontSize:'0.8rem', color:'#94A3B8' }}>{p}</span>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize:'0.72rem', fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.625rem' }}>Chains</p>
            {s.chains.map(c=>(
              <div key={c} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.375rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:s.color }}/><span style={{ fontSize:'0.8rem', color:'#94A3B8' }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button onClick={onClose} style={{ flex:1, height:48, borderRadius:12, border:'none', cursor:'pointer', background:`linear-gradient(135deg, ${s.color}, ${s.color}bb)`, color:'#fff', fontSize:'0.9rem', fontWeight:800, fontFamily:'Outfit,sans-serif', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
            <Zap size={16}/> Invest Now
          </button>
          <button onClick={onClose} style={{ height:48, padding:'0 1.25rem', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'#64748B', fontSize:'0.875rem', cursor:'pointer' }}>Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function StrategyPanel() {
  const [invest, setInvest] = useState<typeof STRATEGIES[0]|null>(null);
  const [details, setDetails] = useState<typeof STRATEGIES[0]|null>(null);
  const [filter, setFilter] = useState('All');

  const filtered = filter==='All' ? STRATEGIES : STRATEGIES.filter(s=>s.risk===filter||s.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'1.5rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#F59E0B,#EF4444)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(245,158,11,0.4)' }}><Zap size={18} color="#fff"/></div>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'#F8FAFC', letterSpacing:'-0.02em' }}>AI Strategies</h1>
            <p style={{ fontSize:'0.825rem', color:'#64748B' }}>Click any card — Details shows full analytics, Invest opens the deposit flow</p>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.875rem', marginBottom:'1.5rem' }}>
          {[['Strategies','5','#3B82F6'],['Total Agents','500+','#10B981'],['Avg APY','69.2%','#F59E0B'],['Total TVL','$84.2M','#8B5CF6']].map(([l,v,c])=>(
            <div key={l} className="metric-card" style={{ textAlign:'center', borderTop:`2px solid ${c}35` }}>
              <div style={{ fontSize:'1.625rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:c as string, marginBottom:'0.25rem' }}>{v}</div>
              <div style={{ fontSize:'0.65rem', color:'#64748B', textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {['All','Very Low Risk','Low Risk','Medium Risk','High Risk'].map(f=>(
            <button key={f} onClick={()=>setFilter(f==='All'?'All':f.replace(' Risk',''))}
              style={{ padding:'0.375rem 1rem', borderRadius:99, fontSize:'0.75rem', fontWeight:700, cursor:'pointer', border:'none', transition:'all 0.15s',
                background:filter===(f==='All'?'All':f.replace(' Risk',''))?'#3B82F6':'rgba(255,255,255,0.05)', color:filter===(f==='All'?'All':f.replace(' Risk',''))?'#fff':'#64748B' }}>{f}</button>
          ))}
        </div>
      </motion.div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(360px,1fr))', gap:'1.25rem' }}>
        {filtered.map((s,i)=>(
          <motion.div key={s.id} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
            whileHover={{ y:-6, boxShadow:`0 24px 48px rgba(0,0,0,0.6), 0 0 40px ${s.color}15` }}
            style={{ padding:'1.5rem', borderRadius:20, border:`1px solid ${s.color}22`, background:'linear-gradient(135deg,rgba(13,17,23,0.9),rgba(22,29,44,0.8))', backdropFilter:'blur(20px)', position:'relative', overflow:'hidden', cursor:'pointer', transition:'all 0.25s' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${s.color},transparent)` }}/>
            <div style={{ position:'absolute', top:-40, right:-40, width:130, height:130, borderRadius:'50%', background:`radial-gradient(circle,${s.color}12 0%,transparent 70%)`, filter:'blur(20px)', pointerEvents:'none' }}/>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.125rem' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.375rem' }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, boxShadow:`0 0 8px ${s.color}` }}/>
                  <h3 style={{ fontSize:'1.05rem', fontWeight:800, color:'#F8FAFC', fontFamily:'Outfit,sans-serif' }}>{s.name}</h3>
                </div>
                <span style={{ fontSize:'0.62rem', fontWeight:700, padding:'0.18rem 0.6rem', borderRadius:99, background:`${riskColor[s.risk]}15`, color:riskColor[s.risk], border:`1px solid ${riskColor[s.risk]}25` }}>{s.risk} Risk · {s.agents} agents</span>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'2rem', fontWeight:900, color:s.color, fontFamily:'Outfit,sans-serif', lineHeight:1 }}>{s.apy}%</div>
                <div style={{ fontSize:'0.62rem', color:'#64748B' }}>APY</div>
              </div>
            </div>
            <div style={{ height:64, marginBottom:'1.125rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.chart.map((v,i)=>({i,v}))}>
                  <defs><linearGradient id={`sg${s.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={s.color} stopOpacity={0.25}/><stop offset="95%" stopColor={s.color} stopOpacity={0}/></linearGradient></defs>
                  <Area type="monotone" dataKey="v" stroke={s.color} strokeWidth={2} fill={`url(#sg${s.id})`} dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginBottom:'1.125rem' }}>
              {[['Sharpe',s.sharpe,'#60A5FA'],['Win Rate',`${s.winRate}%`,'#34D399'],['Max DD',`-${s.drawdown}%`,'#F87171']].map(([l,v,c])=>(
                <div key={l as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'0.5rem', textAlign:'center', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize:'0.55rem', color:'#475569', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.2rem' }}>{l}</div>
                  <div style={{ fontSize:'0.9rem', fontWeight:800, color:c as string, fontFamily:'Outfit,sans-serif' }}>{v}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize:'0.75rem', color:'#64748B', lineHeight:1.6, marginBottom:'1.125rem' }}>{s.desc.slice(0,100)}...</p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={()=>setInvest(s)}
                style={{ flex:1, height:42, borderRadius:12, border:'none', cursor:'pointer', background:`linear-gradient(135deg,${s.color},${s.color}bb)`, color:'#fff', fontSize:'0.85rem', fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.375rem', boxShadow:`0 0 20px ${s.color}35` }}>
                <Zap size={14}/> Invest
              </motion.button>
              <motion.button whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }} onClick={()=>setDetails(s)}
                style={{ height:42, padding:'0 1.125rem', borderRadius:12, border:`1px solid ${s.color}30`, background:`${s.color}08`, color:s.color, fontSize:'0.85rem', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:'0.375rem' }}>
                <TrendingUp size={14}/> Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {invest && <InvestModal s={invest} onClose={()=>setInvest(null)}/>}
        {details && <DetailsModal s={details} onClose={()=>setDetails(null)}/>}
      </AnimatePresence>
    </div>
  );
}
