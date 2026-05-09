import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Zap, Activity, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';

const CHAINS = [
  { name:'Ethereum',  symbol:'ETH', color:'#627EEA', tvl:'$29.4M', apy:'48.2%', agents:127, latency:'12ms',  gas:'$2.40',  status:'optimal' },
  { name:'Arbitrum',  symbol:'ARB', color:'#12AAFF', tvl:'$18.7M', apy:'62.8%', agents:98,  latency:'380ms', gas:'$0.04',  status:'optimal' },
  { name:'Polygon',   symbol:'POL', color:'#8247E5', tvl:'$12.1M', apy:'55.4%', agents:76,  latency:'2.1s',  gas:'$0.01',  status:'optimal' },
  { name:'Base',      symbol:'BASE',color:'#0052FF', tvl:'$8.3M',  apy:'71.2%', agents:54,  latency:'2s',    gas:'$0.005', status:'optimal' },
  { name:'0G Chain',  symbol:'0G',  color:'#10B981', tvl:'$15.8M', apy:'87.3%', agents:145, latency:'0.8s',  gas:'$0.001', status:'active' },
];

const ARBS = [
  { pair:'ETH → ARB', profit:'+$1,840/hr', size:'$24.2K', spread:'2.34%', chain:'ETH/ARB', color:'#3B82F6' },
  { pair:'USDC → Polygon', profit:'+$620/hr',  size:'$8.1K',  spread:'1.12%', chain:'ETH/POL', color:'#8247E5' },
  { pair:'BTC → 0G',  profit:'+$3,120/hr', size:'$41.7K', spread:'3.81%', chain:'ETH/0G',  color:'#10B981' },
  { pair:'ETH → Base', profit:'+$890/hr',  size:'$12.4K', spread:'1.67%', chain:'ETH/BASE',color:'#0052FF' },
];

const BRIDGES = [
  { from:'ETH', to:'ARB',  amount:'$12.4K', status:'executing', color:'#12AAFF' },
  { from:'0G',  to:'ETH',  amount:'$8.7K',  status:'completed', color:'#10B981' },
  { from:'POL', to:'BASE', amount:'$3.2K',  status:'pending',   color:'#8247E5' },
];

export default function CrossChainDashboard() {
  const [tick, setTick] = useState(0);
  useEffect(()=>{ const t=setInterval(()=>setTick(n=>n+1),3000); return ()=>clearInterval(t); },[]);

  const fadeIn=(i:number)=>({ initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{delay:i*0.07} });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.375rem' }}>
      <motion.div {...fadeIn(0)}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'0.3rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#10B981,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(16,185,129,0.4)' }}>
            <Globe size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Cross-Chain Omni-Agents</h1>
            <p style={{ fontSize:'0.825rem', color:'var(--text-muted)' }}>Operate on multiple chains for maximum yield extraction</p>
          </div>
        </div>
      </motion.div>

      {/* Chain cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'0.875rem' }}>
        {CHAINS.map((c,i)=>(
          <motion.div key={c.name} {...fadeIn(i+1)} className="card" whileHover={{ y:-4 }}
            style={{ padding:'1.125rem', borderTop:`2px solid ${c.color}50`, cursor:'pointer' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.875rem' }}>
              <div style={{ width:36, height:36, borderRadius:10, background:`${c.color}20`, border:`1px solid ${c.color}35`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:900, color:c.color, fontFamily:'Outfit,sans-serif' }}>{c.symbol}</div>
              <div style={{ width:7, height:7, borderRadius:'50%', background:c.status==='optimal'?'var(--green)':'var(--blue)' }} className="live-dot" />
            </div>
            <div style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text-primary)', marginBottom:'0.75rem' }}>{c.name}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.375rem' }}>
              {[['TVL',c.tvl,'var(--text-primary)'],['APY',c.apy,c.color],['Agents',c.agents,'var(--text-secondary)'],['Latency',c.latency,'var(--text-muted)'],['Gas',c.gas,'var(--green-l)']].map(([l,v,col])=>(
                <div key={l as string} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem' }}>
                  <span style={{ color:'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontWeight:700, color:col as string }}>{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Arb + Bridge Activity */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <motion.div {...fadeIn(6)} className="card" style={{ padding:'1.375rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Live Arbitrage Opportunities</h3>
              <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.15rem' }}>Real-time cross-chain spread capture</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
              <div className="live-dot" style={{ width:6, height:6, background:'var(--green)' }} />
              <span style={{ fontSize:'0.65rem', color:'var(--green-l)', fontWeight:700 }}>LIVE</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {ARBS.map((a,i)=>(
              <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.1 }}
                style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.875rem', borderRadius:'var(--r-lg)', background:`${a.color}08`, border:`1px solid ${a.color}25`, cursor:'pointer' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${a.color}20`, border:`1px solid ${a.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800, color:a.color, textAlign:'center', flexShrink:0, lineHeight:1.2 }}>
                  {a.chain.split('/').join('\n').slice(0,3)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--text-primary)', marginBottom:'0.15rem' }}>{a.pair}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Size: {a.size} · Spread: {a.spread}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:'1rem', fontWeight:900, color:'var(--green-l)', fontFamily:'Outfit,sans-serif' }}>{a.profit}</div>
                  <button style={{ marginTop:'0.2rem', padding:'0.15rem 0.5rem', borderRadius:6, fontSize:'0.6rem', fontWeight:700, background:`${a.color}15`, color:a.color, border:`1px solid ${a.color}25`, cursor:'pointer' }}>Execute</button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeIn(7)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Bridge Activity</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Live cross-chain capital movement</p>

          {/* Visual bridge */}
          <div style={{ position:'relative', height:160, marginBottom:'1.25rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
            {/* Chain orbs */}
            {CHAINS.slice(0,4).map((c,i)=>{
              const angle = (i/4)*Math.PI*2 - Math.PI/2;
              const r = 60;
              const x = 50 + Math.cos(angle)*r;
              const y = 50 + Math.sin(angle)*r;
              return (
                <div key={c.name} style={{ position:'absolute', left:`${x}%`, top:`${y}%`, transform:'translate(-50%,-50%)', width:36, height:36, borderRadius:'50%', background:`${c.color}20`, border:`2px solid ${c.color}50`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.62rem', fontWeight:900, color:c.color, boxShadow:`0 0 16px ${c.color}40` }}>
                  {c.symbol}
                </div>
              );
            })}
            {/* Center 0G */}
            <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', width:44, height:44, borderRadius:'50%', background:'rgba(16,185,129,0.2)', border:'2px solid rgba(16,185,129,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:900, color:'var(--green)', boxShadow:'0 0 24px rgba(16,185,129,0.4)' }}>0G</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
            {BRIDGES.map((b,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.625rem 0.875rem', borderRadius:'var(--r-lg)', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)' }}>{b.from}</span>
                  <span style={{ fontSize:'0.7rem', color:'var(--text-dim)' }}>→</span>
                  <span style={{ fontSize:'0.8rem', fontWeight:700, color:b.color }}>{b.to}</span>
                  <span style={{ fontSize:'0.72rem', color:'var(--text-secondary)' }}>· {b.amount}</span>
                </div>
                <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'0.15rem 0.5rem', borderRadius:99, background:b.status==='completed'?'rgba(16,185,129,0.12)':b.status==='executing'?'rgba(59,130,246,0.12)':'rgba(245,158,11,0.12)', color:b.status==='completed'?'var(--green-l)':b.status==='executing'?'var(--blue-l)':'var(--gold-l)' }}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
