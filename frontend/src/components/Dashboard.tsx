import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, TrendingUp, Award, Shield, Activity, ArrowUpRight, ArrowDownRight, ChevronRight, ExternalLink, Zap, RefreshCw } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TVL_DATA = [
  { m:'Oct', tvl:9 }, { m:'Nov', tvl:14 }, { m:'Dec', tvl:22 },
  { m:'Jan', tvl:34 }, { m:'Feb', tvl:48 }, { m:'Mar', tvl:63 },
  { m:'Apr', tvl:74 }, { m:'May', tvl:84.2 },
];
const PERF_DATA = [
  { d:'Nov', port:82000, bench:79000 }, { d:'Dec', port:91000, bench:80500 },
  { d:'Jan', port:99000, bench:79000 }, { d:'Feb', port:112000, bench:83000 },
  { d:'Mar', port:124000, bench:85000 }, { d:'Apr', port:138000, bench:87000 },
  { d:'May', port:149000, bench:88500 },
];
const APY_DATA = [
  { m:'Oct', apy:42 }, { m:'Nov', apy:51 }, { m:'Dec', apy:55 },
  { m:'Jan', apy:58 }, { m:'Feb', apy:61 }, { m:'Mar', apy:63 },
  { m:'Apr', apy:59 }, { m:'May', apy:60.2 },
];
const HEATMAP_AGENTS = ['Yield+', 'Volatility', 'Arbitrage', 'Stable', 'Epsilon', 'Maker'];
const HEATMAP_DATA = [[87,97,71,82,93],[76,84,69,48,78],[73,76,74,94,86],[48,67,89,98,95],[95,100,78,88,90],[61,64,63,82,72]];
const TOP_AGENTS = [
  { name:'Yield Harvester+', apy:87.3, winRate:71.3, sharpe:1.94, tvl:2.4, holders:1247, color:'#3B82F6', change:'+4.2%' },
  { name:'Volatility Surge',  apy:76.1, winRate:68.5, sharpe:1.67, tvl:1.8, holders:892,  color:'#10B981', change:'+2.1%' },
  { name:'Arbitrage Master',  apy:72.8, winRate:74.2, sharpe:1.52, tvl:1.2, holders:567,  color:'#8B5CF6', change:'+1.5%' },
  { name:'Stablecoin Pro',    apy:48.2, winRate:89.1, sharpe:1.34, tvl:3.2, holders:2341, color:'#F59E0B', change:'-0.2%' },
];
const LIVE_FEED = [
  { time:'now',   action:'Yield Harvester+ executed USDC yield harvest',    profit:'+$340', chain:'0G',  hash:'0x7a3f...d4c2', color:'#3B82F6' },
  { time:'12s',   action:'Volatility Surge closed ETH long position',         profit:'+$187', chain:'ETH', hash:'0x4c2a...b891', color:'#10B981' },
  { time:'35s',   action:'Arbitrage Master cross-DEX swap on Uni V4',         profit:'+$93',  chain:'ARB', hash:'0x9f1e...7321', color:'#8B5CF6' },
  { time:'1m',    action:'Epsilon Core Gen 4 rebalanced full portfolio',       profit:'+$520', chain:'0G',  hash:'0x2d8b...a410', color:'#F59E0B' },
  { time:'2m',    action:'Stablecoin Pro harvested Aave V3 rewards',          profit:'+$44',  chain:'ETH', hash:'0x6e4c...f902', color:'#10B981' },
];
const ALLOC = [
  { label:'Yield Farming', pct:42, color:'#3B82F6' },
  { label:'Volatility Surf', pct:28, color:'#8B5CF6' },
  { label:'LP Fees', pct:18, color:'#10B981' },
  { label:'Momentum', pct:12, color:'#F59E0B' },
];

function HeatCell({ val }: { val: number }) {
  const [bg,fg] = val>=85?['rgba(16,185,129,0.18)','#34D399']:val>=70?['rgba(59,130,246,0.18)','#60A5FA']:val>=55?['rgba(245,158,11,0.15)','#FCD34D']:['rgba(239,68,68,0.15)','#F87171'];
  return <td style={{ padding:'0.35rem 0.4rem', textAlign:'center' }}><div style={{ padding:'0.2rem 0.4rem', borderRadius:6, background:bg, color:fg, fontSize:'0.72rem', fontWeight:700, fontFamily:'Outfit,sans-serif' }}>{val}</div></td>;
}

const TT = ({ active, payload, label }: any) => {
  if (!active||!payload?.length) return null;
  return <div style={{ background:'rgba(8,12,24,0.98)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'var(--r-lg)', padding:'0.75rem 1rem', boxShadow:'0 20px 40px rgba(0,0,0,0.5)' }}>
    <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:'0.375rem' }}>{label}</p>
    {payload.map((p:any) => <p key={p.dataKey} style={{ fontSize:'0.875rem', fontWeight:700, color:p.color }}>{p.name}: ${typeof p.value==='number'&&p.value>1000?(p.value/1000).toFixed(0)+'K':p.value}{p.unit}</p>)}
  </div>;
};

export default function Dashboard() {
  const [tvl, setTvl] = useState(84.2);
  const [profit, setProfit] = useState(6.32);
  const [period, setPeriod] = useState<'7D'|'30D'|'90D'>('30D');
  const [feedItems, setFeedItems] = useState(LIVE_FEED);

  useEffect(() => {
    const t = setInterval(() => {
      setTvl(v => parseFloat((v + Math.random()*0.03).toFixed(2)));
      setProfit(v => parseFloat((v + Math.random()*0.006).toFixed(3)));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const fadeIn = (i:number) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{delay:i*0.07, duration:0.5} });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.375rem' }}>
      {/* Header */}
      <motion.div {...fadeIn(0)}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.25rem' }}>
          <div>
            <h1 style={{ fontSize:'1.625rem', fontWeight:900, color:'var(--text-primary)', fontFamily:'Outfit,sans-serif', letterSpacing:'-0.02em' }}>Welcome back, Maanyu 👋</h1>
            <p style={{ fontSize:'0.825rem', color:'var(--text-muted)', marginTop:'0.2rem' }}>Here's what your AI agents are achieving today.</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.4rem 0.875rem', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'var(--r-full)' }}>
            <div className="live-dot" style={{ width:7, height:7, background:'var(--green)' }} />
            <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--green-l)' }}>All Chains Operational</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:'1rem' }}>
        {[
          { label:'Total TVL', val:`$${tvl.toFixed(1)}M`, change:'+25% last week', icon:DollarSign, color:'#3B82F6', glow:'rgba(59,130,246,0.15)', borderColor:'rgba(59,130,246,0.25)' },
          { label:'Total Profits', val:`$${profit.toFixed(2)}M`, change:'+17% past month', icon:TrendingUp, color:'#10B981', glow:'rgba(16,185,129,0.15)', borderColor:'rgba(16,185,129,0.25)' },
          { label:'Active Agents', val:'500+', change:'+43 this week', icon:Zap, color:'#8B5CF6', glow:'rgba(139,92,246,0.15)', borderColor:'rgba(139,92,246,0.25)' },
          { label:'Avg. APY', val:'60.2%', change:'+6.4% last month', icon:Award, color:'#F59E0B', glow:'rgba(245,158,11,0.15)', borderColor:'rgba(245,158,11,0.25)' },
          { label:'Revenue', val:'$2.41M', change:'+21% from last month', icon:Shield, color:'#EF4444', glow:'rgba(239,68,68,0.15)', borderColor:'rgba(239,68,68,0.25)' },
        ].map((s,i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} {...fadeIn(i+1)} className="metric-card"
              style={{ borderTop:`2px solid ${s.borderColor}`, background:`linear-gradient(135deg, rgba(13,17,23,0.9), rgba(13,17,23,0.6))` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.875rem' }}>
                <span className="metric-label">{s.label}</span>
                <div style={{ width:34, height:34, borderRadius:10, background:s.glow, border:`1px solid ${s.color}25`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={15} style={{ color:s.color }} />
                </div>
              </div>
              <div className="metric-value" style={{ fontSize:'1.625rem', color:s.color, fontFamily:'Outfit,sans-serif' }}>{s.val}</div>
              <div className="metric-change up" style={{ marginTop:'0.4rem' }}>
                <ArrowUpRight size={12} />{s.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem' }}>
        {/* TVL Growth */}
        <motion.div {...fadeIn(6)} className="card" style={{ padding:'1.375rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
            <div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>TVL Growth</h3>
              <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.15rem' }}>↑ +25.4% from last week · All time high</p>
            </div>
            <div style={{ display:'flex', gap:'0.375rem' }}>
              {(['7D','30D','90D'] as const).map(p => (
                <button key={p} onClick={()=>setPeriod(p)} style={{ padding:'0.225rem 0.625rem', borderRadius:8, fontSize:'0.7rem', fontWeight:700, cursor:'pointer', border:'none', transition:'all 0.15s', background:period===p?'var(--blue)':'rgba(255,255,255,0.04)', color:period===p?'#fff':'var(--text-muted)' }}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TVL_DATA}>
                <defs>
                  <linearGradient id="gTVL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} unit="M" />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="tvl" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gTVL)" dot={false} name="TVL" unit="M" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* APY Trend */}
        <motion.div {...fadeIn(7)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>APY Trend</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Platform average over time</p>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={APY_DATA}>
                <defs>
                  <linearGradient id="gAPY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<TT />} />
                <Area type="monotone" dataKey="apy" stroke="#10B981" strokeWidth={2.5} fill="url(#gAPY)" dot={false} name="APY" unit="%" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Charts row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem' }}>
        {/* Portfolio vs Bench */}
        <motion.div {...fadeIn(8)} className="card" style={{ padding:'1.375rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Portfolio vs Benchmark</h3>
              <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.15rem' }}>Outperforming S&P 500 by +34%</p>
            </div>
            <span className="badge badge-green">+34% Alpha</span>
          </div>
          <div style={{ height:230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERF_DATA}>
                <defs>
                  <linearGradient id="gPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="d" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<TT />} />
                <Legend wrapperStyle={{ fontSize:'0.72rem', color:'#64748B' }} />
                <Area type="monotone" dataKey="port" stroke="#10B981" strokeWidth={2.5} fill="url(#gPort)" name="Portfolio" dot={false} />
                <Line type="monotone" dataKey="bench" stroke="#475569" strokeWidth={1.5} strokeDasharray="5 5" name="S&P 500" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Activity */}
        <motion.div {...fadeIn(9)} className="card" style={{ padding:'1.375rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
            <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Live Activity</h3>
            <div style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
              <div className="live-dot" style={{ width:6, height:6, background:'var(--green)' }} />
              <span style={{ fontSize:'0.65rem', color:'var(--green-l)', fontWeight:700 }}>LIVE</span>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem', overflowY:'auto', maxHeight:250 }} className="scrollbar-none">
            {feedItems.map((f,i) => (
              <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.08 }}
                style={{ padding:'0.625rem 0.75rem', borderRadius:'var(--r-md)', background:'rgba(255,255,255,0.02)', border:`1px solid ${f.color}15`, borderLeft:`2px solid ${f.color}60` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.2rem' }}>
                  <span style={{ fontSize:'0.62rem', color:'var(--text-muted)' }}>{f.time} ago</span>
                  <span style={{ fontSize:'0.72rem', fontWeight:800, color:'var(--green-l)' }}>{f.profit}</span>
                </div>
                <p style={{ fontSize:'0.72rem', color:'var(--text-secondary)', lineHeight:1.4, marginBottom:'0.25rem' }}>{f.action}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
                  <span style={{ fontSize:'0.58rem', padding:'0.1rem 0.4rem', borderRadius:99, background:f.color+'15', color:f.color, fontWeight:700 }}>{f.chain}</span>
                  <a href="#" style={{ fontSize:'0.58rem', color:'var(--text-dim)', fontFamily:'JetBrains Mono,monospace', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.15rem' }}>
                    {f.hash} <ExternalLink size={9} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Heatmap + Top Agents */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <motion.div {...fadeIn(10)} className="card" style={{ padding:'1.375rem', overflowX:'auto' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Agent Performance Heatmap</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Normalized scores (0–100) across key metrics</p>
          <table style={{ borderCollapse:'collapse', width:'100%' }}>
            <thead>
              <tr>
                <th style={{ padding:'0.35rem 0.5rem', fontSize:'0.62rem', color:'var(--text-muted)', fontWeight:700, textAlign:'left', textTransform:'uppercase', letterSpacing:'0.08em' }}>Agent</th>
                {['APY','Sharpe','Win Rate','Drawdown','Pf Factor'].map(m => (
                  <th key={m} style={{ padding:'0.35rem 0.5rem', fontSize:'0.58rem', color:'var(--text-muted)', fontWeight:700, textAlign:'center', textTransform:'uppercase', letterSpacing:'0.07em' }}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_AGENTS.map((a,i) => (
                <tr key={a}>
                  <td style={{ padding:'0.35rem 0.5rem', fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:700 }}>{a}</td>
                  {HEATMAP_DATA[i].map((v,j) => <HeatCell key={j} val={v} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div {...fadeIn(11)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.25rem' }}>Top Performing Strategies</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {TOP_AGENTS.map((a,i) => (
              <motion.div key={i} whileHover={{ x:2 }}
                style={{ display:'flex', alignItems:'center', gap:'0.875rem', padding:'0.875rem', borderRadius:'var(--r-lg)', background:'rgba(255,255,255,0.025)', border:`1px solid ${a.color}18`, cursor:'pointer', transition:'all 0.2s' }}>
                <div style={{ width:38, height:38, borderRadius:11, background:`${a.color}18`, border:`1px solid ${a.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:'0.875rem', color:a.color, fontFamily:'Outfit,sans-serif', flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:'0.85rem', color:'var(--text-primary)', marginBottom:'0.1rem' }}>{a.name}</p>
                  <p style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{a.holders.toLocaleString()} investors · ${a.tvl}M TVL · Sharpe {a.sharpe}</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'1.2rem', fontWeight:900, color:a.color, fontFamily:'Outfit,sans-serif' }}>{a.apy}%</div>
                  <div style={{ fontSize:'0.65rem', color:a.change.startsWith('+') ? 'var(--green-l)' : 'var(--red-l)', fontWeight:600 }}>{a.change}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Capital Allocation */}
      <motion.div {...fadeIn(12)} className="card" style={{ padding:'1.375rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem' }}>
          <div>
            <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Capital Allocation</h3>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'0.15rem' }}>Across all AI agent strategies</p>
          </div>
          <button className="btn-ghost" style={{ fontSize:'0.72rem', height:30, padding:'0 0.75rem' }}><RefreshCw size={12} /> Rebalance</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
          {ALLOC.map(s => (
            <div key={s.label} style={{ padding:'1rem', background:'rgba(255,255,255,0.025)', borderRadius:'var(--r-lg)', border:`1px solid ${s.color}18` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.75rem' }}>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:500 }}>{s.label}</span>
                <span style={{ fontSize:'1rem', fontWeight:900, color:s.color, fontFamily:'Outfit,sans-serif' }}>{s.pct}%</span>
              </div>
              <div className="progress-bar">
                <motion.div className="progress-fill" initial={{ width:0 }} animate={{ width:`${s.pct}%` }} transition={{ duration:1.2, delay:0.5, ease:[0.34,1.56,0.64,1] }}
                  style={{ background:`linear-gradient(90deg, ${s.color}, ${s.color}aa)`, boxShadow:`0 0 8px ${s.color}50` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
