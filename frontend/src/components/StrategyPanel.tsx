import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Shield, RefreshCw, ArrowUpRight, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STRATEGIES = [
  { id:1, name:'Yield Farming', color:'#3B82F6', apy:87.3, sharpe:1.94, winRate:71.3, agents:127, desc:'Multi-protocol yield optimization across Aave, Curve, Balancer, and Yearn. Auto-compounds every 24h with gas optimization.', risk:'Medium', minTVL:'$100', chart:[60,72,68,80,85,90,87,95,88,92,96,87] },
  { id:2, name:'Volatility Trading', color:'#8B5CF6', apy:76.1, sharpe:1.67, winRate:68.5, agents:98,  desc:'Momentum-based trading on ETH/BTC using on-chain sentiment, funding rates, and order flow analysis.', risk:'High', minTVL:'$250', chart:[55,62,70,65,75,80,72,85,78,82,76,80] },
  { id:3, name:'Arbitrage', color:'#F59E0B', apy:72.8, sharpe:1.52, winRate:74.2, agents:76,  desc:'Cross-DEX and cross-chain arbitrage capturing price discrepancies in milliseconds across Uniswap, Curve, and Balancer.', risk:'Low', minTVL:'$500', chart:[50,58,65,70,68,75,73,78,72,76,74,72] },
  { id:4, name:'Stable Yield', color:'#10B981', apy:48.2, sharpe:1.34, winRate:89.1, agents:145, desc:'Ultra-safe stablecoin optimization. Only USDC/USDT/DAI — zero liquidation risk. Consistent 40-55% APY.', risk:'Very Low', minTVL:'$50', chart:[42,44,46,45,47,49,48,50,49,48,48,48] },
  { id:5, name:'Market Making', color:'#06B6D4', apy:61.4, sharpe:1.28, winRate:63.2, agents:54,  desc:'Provides concentrated liquidity on Uniswap V4, earns swap fees on high-volume ETH/USDC and BTC/USDC pairs.', risk:'Medium', minTVL:'$200', chart:[52,56,60,58,62,65,63,66,61,64,62,61] },
];

const riskColor: Record<string,string> = { 'Very Low':'#10B981', Low:'#34D399', Medium:'#F59E0B', High:'#EF4444' };

export default function StrategyPanel() {
  const [selected, setSelected] = useState<typeof STRATEGIES[0]|null>(null);
  const fadeIn=(i:number)=>({initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{delay:i*0.07}});

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.375rem' }}>
      <motion.div {...fadeIn(0)}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'0.3rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#F59E0B,#EF4444)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(245,158,11,0.4)' }}>
            <Zap size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>AI Strategies</h1>
            <p style={{ fontSize:'0.825rem', color:'var(--text-muted)' }}>Multi-strategy agent types powering the platform</p>
          </div>
        </div>
      </motion.div>

      {/* Overview stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.875rem' }}>
        {[
          { l:'Active Strategies', v:'5', c:'#3B82F6' },
          { l:'Total Agents', v:'500+', c:'#10B981' },
          { l:'Combined APY', v:'69.2%', c:'#F59E0B' },
          { l:'Total TVL', v:'$84.2M', c:'#8B5CF6' },
        ].map(({l,v,c})=>(
          <div key={l} className="metric-card" style={{ textAlign:'center', borderTop:`2px solid ${c}35` }}>
            <div style={{ fontSize:'1.625rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:c, marginBottom:'0.3rem' }}>{v}</div>
            <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Strategy cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px,1fr))', gap:'1.25rem' }}>
        {STRATEGIES.map((s,i)=>(
          <motion.div key={s.id} {...fadeIn(i+1)} className="card"
            whileHover={{ y:-5, boxShadow:`0 20px 40px rgba(0,0,0,0.6), 0 0 30px ${s.color}12` }}
            onClick={()=>setSelected(selected?.id===s.id?null:s)}
            style={{ padding:'1.375rem', cursor:'pointer', border:`1px solid ${s.color}18`, position:'relative', overflow:'hidden' }}>
            
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
            <div style={{ position:'absolute', top:-30, right:-30, width:100, height:100, borderRadius:'50%', background:`radial-gradient(circle, ${s.color}12 0%, transparent 70%)`, filter:'blur(20px)', pointerEvents:'none' }} />

            {/* Header */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.375rem' }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, boxShadow:`0 0 8px ${s.color}` }} />
                  <h3 style={{ fontSize:'1rem', fontWeight:800, color:'var(--text-primary)', fontFamily:'Outfit,sans-serif' }}>{s.name}</h3>
                </div>
                <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
                  <span style={{ fontSize:'0.62rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:99, background:`${riskColor[s.risk]}15`, color:riskColor[s.risk], border:`1px solid ${riskColor[s.risk]}25` }}>
                    {s.risk} Risk
                  </span>
                  <span style={{ fontSize:'0.62rem', color:'var(--text-muted)' }}>{s.agents} agents</span>
                </div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'1.75rem', fontWeight:900, color:s.color, fontFamily:'Outfit,sans-serif', lineHeight:1 }}>{s.apy}%</div>
                <div style={{ fontSize:'0.62rem', color:'var(--text-muted)' }}>APY</div>
              </div>
            </div>

            {/* Mini chart */}
            <div style={{ height:60, marginBottom:'1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={s.chart.map((v,i)=>({i,v}))}>
                  <defs>
                    <linearGradient id={`gs${s.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="v" stroke={s.color} strokeWidth={2} fill={`url(#gs${s.id})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Metrics row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginBottom:'1rem' }}>
              {[['Sharpe',s.sharpe,'var(--blue-l)'],['Win Rate',`${s.winRate}%`,'var(--green-l)'],['Min TVL',s.minTVL,'var(--text-secondary)']].map(([l,v,c])=>(
                <div key={l} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'0.5rem', textAlign:'center', border:'1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:'0.2rem' }}>{l}</div>
                  <div style={{ fontSize:'0.875rem', fontWeight:800, color:c as string, fontFamily:'Outfit,sans-serif' }}>{v}</div>
                </div>
              ))}
            </div>

            <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', lineHeight:1.6, marginBottom:'1rem' }}>{s.desc}</p>

            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn-primary" style={{ flex:1, height:38, fontSize:'0.8rem', borderRadius:10 }}>
                <ArrowUpRight size={13} /> Invest
              </button>
              <button className="btn-ghost" style={{ height:38, padding:'0 0.875rem', fontSize:'0.8rem' }}>
                Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
