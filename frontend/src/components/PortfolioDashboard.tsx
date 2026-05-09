import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, ArrowUpRight, Activity, Zap, ExternalLink } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';

const NET_WORTH = [
  { m:'Oct', v:32000 }, { m:'Nov', v:36500 }, { m:'Dec', v:41200 },
  { m:'Jan', v:38900 }, { m:'Feb', v:45300 }, { m:'Mar', v:51800 },
  { m:'Apr', v:58200 }, { m:'May', v:42347 },
];
const INCOME = [
  { m:'Oct', y:820 }, { m:'Nov', y:1100 }, { m:'Dec', y:1450 },
  { m:'Jan', y:1380 }, { m:'Feb', y:1720 }, { m:'Mar', y:2100 },
  { m:'Apr', v:1890 }, { m:'May', y:2340 },
];
const ALLOC = [
  { name:'Yield Harvester+', value:42, color:'#3B82F6' },
  { name:'Stablecoin Pro', value:28, color:'#10B981' },
  { name:'Volatility Surge', value:18, color:'#8B5CF6' },
  { name:'Arbitrage Master', value:12, color:'#F59E0B' },
];
const AGENTS = [
  { name:'Yield Harvester+', invested:11000, current:16930, pnl:5930, pnlPct:53.9, apy:87.3, color:'#3B82F6', action:'Compound' },
  { name:'Stablecoin Pro',   invested:12000, current:12754, pnl:754,  pnlPct:6.3,  apy:48.2, color:'#10B981', action:'Withdraw' },
];
const ACTIVITIES = [
  { icon:'⚡', msg:'Yield Harvester+ earned $340 in yield', time:'2m ago', color:'#3B82F6' },
  { icon:'💰', msg:'Auto-compound executed: +$187 reinvested', time:'15m ago', color:'#10B981' },
  { icon:'🔄', msg:'Stablecoin Pro rebalanced to Aave V3', time:'1h ago', color:'#10B981' },
  { icon:'🧬', msg:'New Gen-5 breeding opportunity available', time:'3h ago', color:'#8B5CF6' },
  { icon:'📊', msg:'Monthly report: +18.4% portfolio growth', time:'1d ago', color:'#F59E0B' },
];

export default function PortfolioDashboard() {
  const [value, setValue] = useState(42347);
  const [dailyPnl, setDailyPnl] = useState(347);

  useEffect(() => {
    const t = setInterval(() => {
      setValue(v => Math.round(v + (Math.random()-0.3)*20));
      setDailyPnl(v => Math.round(v + (Math.random()-0.2)*5));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const fadeIn = (i:number) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{delay:i*0.08} });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.375rem' }}>
      {/* Header */}
      <motion.div {...fadeIn(0)}>
        <h1 style={{ fontSize:'1.625rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>My Portfolio</h1>
        <p style={{ fontSize:'0.825rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>Your AI-managed investments at a glance</p>
      </motion.div>

      {/* Hero value */}
      <motion.div {...fadeIn(1)} className="card" style={{ padding:'2rem', background:'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(16,185,129,0.06) 100%)', borderColor:'rgba(59,130,246,0.2)', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter:'blur(40px)', pointerEvents:'none' }} />
        <div style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.75rem' }}>Total Portfolio Value</div>
        <motion.div animate={{ scale:[1,1.005,1] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
          style={{ fontSize:'3.5rem', fontWeight:900, fontFamily:'Outfit,sans-serif', background:'linear-gradient(135deg, #60A5FA, #34D399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', lineHeight:1, marginBottom:'1rem' }}>
          ${value.toLocaleString()}.50
        </motion.div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'1.5rem', flexWrap:'wrap' }}>
          {[
            { label:"Today's P&L", val:`+$${dailyPnl}`, color:'var(--green-l)' },
            { label:'Monthly Growth', val:'+18.4%', color:'var(--blue-l)' },
            { label:'Projected Annual', val:`+$${Math.round(value*0.6).toLocaleString()}`, color:'var(--purple-l)' },
          ].map(({label,val,color})=>(
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.2rem' }}>{label}</div>
              <div style={{ fontSize:'1.25rem', fontWeight:900, color, fontFamily:'Outfit,sans-serif' }}>{val}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem' }}>
        <motion.div {...fadeIn(2)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Portfolio Growth</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Net worth over time</p>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={NET_WORTH}>
                <defs>
                  <linearGradient id="gPF" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:12 }} formatter={(v:any)=>[`$${v.toLocaleString()}`, 'Value']} />
                <Area type="monotone" dataKey="v" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gPF)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Allocation donut */}
        <motion.div {...fadeIn(3)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1rem' }}>Allocation</h3>
          <div style={{ height:160, position:'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ALLOC} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {ALLOC.map((e,i)=><Cell key={i} fill={e.color} stroke="transparent" />)}
                </Pie>
                <Tooltip contentStyle={{ background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginTop:'0.75rem' }}>
            {ALLOC.map(a=>(
              <div key={a.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:a.color, flexShrink:0 }} />
                  <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{a.name}</span>
                </div>
                <span style={{ fontSize:'0.8rem', fontWeight:700, color:a.color }}>{a.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Agent positions */}
      <motion.div {...fadeIn(4)} className="card" style={{ padding:'1.375rem' }}>
        <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.25rem' }}>Your Agent Positions</h3>
        <table className="table-dark">
          <thead>
            <tr>
              <th>Agent</th><th style={{ textAlign:'right' }}>Invested</th><th style={{ textAlign:'right' }}>Current Value</th>
              <th style={{ textAlign:'right' }}>P&L</th><th style={{ textAlign:'right' }}>APY</th><th style={{ textAlign:'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((a,i)=>(
              <tr key={i}>
                <td>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:`${a.color}20`, border:`1px solid ${a.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.75rem', color:a.color }}>{a.name[0]}</div>
                    <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{a.name}</span>
                  </div>
                </td>
                <td style={{ textAlign:'right', fontWeight:600 }}>${a.invested.toLocaleString()}</td>
                <td style={{ textAlign:'right', fontWeight:700, color:'var(--text-primary)' }}>${a.current.toLocaleString()}</td>
                <td style={{ textAlign:'right' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'0.2rem' }}>
                    <ArrowUpRight size={12} style={{ color:'var(--green-l)' }} />
                    <span style={{ fontWeight:700, color:'var(--green-l)' }}>+${a.pnl.toLocaleString()} ({a.pnlPct}%)</span>
                  </div>
                </td>
                <td style={{ textAlign:'right', fontWeight:800, color:a.color, fontFamily:'Outfit,sans-serif' }}>{a.apy}%</td>
                <td style={{ textAlign:'center' }}>
                  <button className="btn-ghost" style={{ fontSize:'0.72rem', height:28, padding:'0 0.75rem' }}>{a.action}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Recent Activity */}
      <motion.div {...fadeIn(5)} className="card" style={{ padding:'1.375rem' }}>
        <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1rem' }}>Recent AI Activity</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {ACTIVITIES.map((a,i)=>(
            <motion.div key={i} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.07 }}
              style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.75rem', borderRadius:'var(--r-lg)', background:'rgba(255,255,255,0.02)', border:`1px solid ${a.color}12`, borderLeft:`2px solid ${a.color}50` }}>
              <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:500 }}>{a.msg}</p>
              </div>
              <span style={{ fontSize:'0.65rem', color:'var(--text-dim)', whiteSpace:'nowrap' }}>{a.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
