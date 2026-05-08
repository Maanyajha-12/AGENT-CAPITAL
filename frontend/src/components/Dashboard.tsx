import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, TrendingUp, Award, Shield, Activity,
  ArrowUpRight, ArrowDownRight, ChevronRight, ExternalLink, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const PERF_DATA = [
  { date:'Nov', value:85500, bench:82000 }, { date:'Dec', value:91200, bench:83000 },
  { date:'Jan', value:98400, bench:81000 }, { date:'Feb', value:108000, bench:85000 },
  { date:'Mar', value:118500, bench:87000 }, { date:'Apr', value:131200, bench:88500 },
  { date:'May', value:142300, bench:89000 },
];

const TVL_DATA = [
  { m:'Nov', tvl:12 }, { m:'Dec', tvl:18 }, { m:'Jan', tvl:28 },
  { m:'Feb', tvl:38 }, { m:'Mar', tvl:52 }, { m:'Apr', tvl:68 }, { m:'May', tvl:84 },
];

const HEATMAP_AGENTS = ['Yield+', 'Volatility', 'Arbitrage', 'Stable', 'Epsilon', 'Maker'];
const HEATMAP_DATA = [
  [87,97,71,82,93], [76,84,69,48,78], [73,76,74,94,86],
  [48,67,89,98,95], [95,100,78,88,90], [61,64,63,82,72],
];

const TOP_AGENTS = [
  { name:'Yield Harvester+', apy:87.3, winRate:71.3, sharpe:1.94, tvl:2.4, holders:1247, trend:'up', color:'#3B82F6', change:'+4.2%' },
  { name:'Volatility Surge', apy:76.1, winRate:68.5, sharpe:1.67, tvl:1.8, holders:892,  trend:'up', color:'#10B981', change:'+2.1%' },
  { name:'Arbitrage Master', apy:72.8, winRate:74.2, sharpe:1.52, tvl:1.2, holders:567,  trend:'up', color:'#8B5CF6', change:'+1.5%' },
  { name:'Stablecoin Pro',   apy:48.2, winRate:89.1, sharpe:1.34, tvl:3.2, holders:2341, trend:'down', color:'#F59E0B', change:'-0.2%' },
];

const LIVE_FEED = [
  { time:'now',   action:'Yield Harvester+ bought USDC for $12,420',     profit:'+$340', chain:'0G', hash:'0x7a3f...d4c2' },
  { time:'12s',   action:'Volatility Surge sold ETH — position closed',    profit:'+$187', chain:'ETH', hash:'0x4c2a...b891' },
  { time:'35s',   action:'Arbitrage Master cross-DEX swap executed',       profit:'+$93',  chain:'ARB', hash:'0x9f1e...7321' },
  { time:'1m',    action:'Epsilon Core Gen 4 rebalanced portfolio',        profit:'+$520', chain:'0G', hash:'0x2d8b...a410' },
  { time:'2m',    action:'Stablecoin Pro harvested Aave rewards',          profit:'+$44',  chain:'ETH', hash:'0x6e4c...f902' },
];

function HeatCell({ val }: { val: number }) {
  const colors = val >= 85 ? ['rgba(16,185,129,0.2)','#10B981'] : val >= 70 ? ['rgba(59,130,246,0.2)','#60A5FA'] : val >= 55 ? ['rgba(245,158,11,0.15)','#FCD34D'] : ['rgba(239,68,68,0.15)','#F87171'];
  return <td style={{ padding: '0.375rem 0.5rem', textAlign:'center' }}><div style={{ padding:'0.25rem 0.4rem', borderRadius:6, background:colors[0], color:colors[1], fontSize:'0.75rem', fontWeight:700, fontFamily:'Outfit, sans-serif' }}>{val}</div></td>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'rgba(13,17,23,0.95)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-lg)', padding:'0.75rem 1rem' }}>
      <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:'0.375rem' }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ fontSize:'0.875rem', fontWeight:700, color:p.color }}>
          {p.name}: ${(p.value/1000).toFixed(1)}K
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [tvl, setTvl] = useState(84.2);
  const [profit, setProfit] = useState(6.32);
  const [period, setPeriod] = useState<'7D'|'30D'|'90D'>('30D');

  useEffect(() => {
    const t = setInterval(() => {
      setTvl(v => parseFloat((v + Math.random() * 0.02).toFixed(2)));
      setProfit(v => parseFloat((v + Math.random() * 0.005).toFixed(3)));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      {/* Header */}
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'var(--text-primary)', fontFamily:'Outfit, sans-serif', marginBottom:'0.2rem' }}>
          Welcome back, Maanyu 👋
        </h1>
        <p style={{ fontSize:'0.825rem', color:'var(--text-muted)' }}>Here's what your AI agents are achieving today.</p>
      </motion.div>

      {/* Top KPI cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'1rem' }}>
        {[
          { label:'Total TVL',       val:`$${tvl}M`,  change:'+25% last week',  up:true,  icon:DollarSign, color:'#3B82F6', glow:'rgba(59,130,246,0.15)' },
          { label:'Total Profits',   val:`$${profit.toFixed(2)}M`, change:'+17% past month', up:true,  icon:TrendingUp, color:'#10B981', glow:'rgba(16,185,129,0.15)' },
          { label:'Active Agents',   val:'500+',  change:'+43 this week', up:true,  icon:Zap,       color:'#8B5CF6', glow:'rgba(139,92,246,0.15)' },
          { label:'Avg. APY',        val:'60.2%', change:'+6.4% last month', up:true, icon:Award,     color:'#F59E0B', glow:'rgba(245,158,11,0.15)' },
          { label:'Platform Revenue',val:'$2.41M',change:'+21% from last month', up:true, icon:Shield,  color:'#EF4444', glow:'rgba(239,68,68,0.15)' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} className="metric-card" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.08 }}
              style={{ background:`linear-gradient(135deg, rgba(13,17,23,0.9), rgba(13,17,23,0.7))`, borderTop:`1px solid ${s.color}30` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
                <span className="metric-label">{s.label}</span>
                <div style={{ width:32, height:32, borderRadius:9, background:s.glow, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={14} style={{ color:s.color }} />
                </div>
              </div>
              <div className="metric-value" style={{ fontSize:'1.5rem', color:s.color }}>{s.val}</div>
              <div className={`metric-change ${s.up ? 'up' : 'down'}`}>
                <ArrowUpRight size={12} />{s.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem' }}>
        {/* TVL Growth */}
        <div className="card" style={{ padding:'1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>TVL Growth</h3>
              <p style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>↑ +25.4% from last week</p>
            </div>
            <div style={{ display:'flex', gap:'0.375rem' }}>
              {(['7D','30D','90D'] as const).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  style={{ padding:'0.2rem 0.6rem', borderRadius:6, fontSize:'0.7rem', fontWeight:600, cursor:'pointer', border:'none',
                    background: period === p ? 'var(--blue)' : 'rgba(255,255,255,0.05)',
                    color: period === p ? '#fff' : 'var(--text-muted)' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TVL_DATA}>
                <defs>
                  <linearGradient id="gTVL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} unit="M" />
                <Tooltip contentStyle={{ background:'rgba(13,17,23,0.95)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, fontSize:12 }} formatter={(v:any) => [`$${v}M`, 'TVL']} />
                <Area type="monotone" dataKey="tvl" stroke="#3B82F6" strokeWidth={2.5} fill="url(#gTVL)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Profit Generation */}
        <div className="card" style={{ padding:'1.25rem' }}>
          <div style={{ marginBottom:'1rem' }}>
            <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Profit Generation</h3>
            <p style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>↑ 18.2% past month</p>
          </div>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TVL_DATA.slice(-5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'rgba(13,17,23,0.95)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, fontSize:12 }} />
                <Bar dataKey="tvl" fill="#10B981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Portfolio chart + Activity */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem' }}>
        <div className="card" style={{ padding:'1.25rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
            <div>
              <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Portfolio vs Benchmark</h3>
              <p style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Outperforming S&P 500 by +34%</p>
            </div>
          </div>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERF_DATA}>
                <defs>
                  <linearGradient id="gPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize:'0.75rem', color:'#64748B' }} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2.5} fill="url(#gPort)" name="Portfolio" />
                <Line type="monotone" dataKey="bench" stroke="#475569" strokeWidth={1.5} strokeDasharray="5 5" name="S&P 500" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Activity */}
        <div className="card" style={{ padding:'1.25rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.875rem' }}>
            <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Live Activity</h3>
            <a href="#" style={{ display:'flex', alignItems:'center', gap:'0.25rem', fontSize:'0.72rem', color:'var(--blue-l)', textDecoration:'none' }}>
              View all <ChevronRight size={12} />
            </a>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
            {LIVE_FEED.map((f, i) => (
              <motion.div key={i} initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1 }}
                style={{ padding:'0.625rem 0.75rem', borderRadius:'var(--r-md)', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.25rem' }}>
                  <span style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{f.time} ago</span>
                  <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--green)' }}>{f.profit}</span>
                </div>
                <p style={{ fontSize:'0.72rem', color:'var(--text-secondary)', lineHeight:1.4, marginBottom:'0.25rem' }}>{f.action}</p>
                <div style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
                  <span style={{ fontSize:'0.58rem', padding:'0.1rem 0.35rem', borderRadius:99, background:'rgba(59,130,246,0.1)', color:'var(--blue-l)' }}>{f.chain}</span>
                  <a href="#" style={{ fontSize:'0.58rem', color:'var(--text-dim)', fontFamily:'JetBrains Mono, monospace', textDecoration:'none', display:'flex', alignItems:'center', gap:'0.15rem' }}>
                    {f.hash} <ExternalLink size={9} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent heatmap + top agents */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        {/* Heatmap */}
        <div className="card" style={{ padding:'1.25rem', overflowX:'auto' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.25rem' }}>Agent Performance Heatmap</h3>
          <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:'1rem' }}>Normalized scores (0–100)</p>
          <table style={{ borderCollapse:'collapse', width:'100%' }}>
            <thead>
              <tr>
                <th style={{ padding:'0.4rem 0.5rem', fontSize:'0.65rem', color:'var(--text-muted)', fontWeight:600, textAlign:'left', textTransform:'uppercase', letterSpacing:'0.06em' }}>Agent</th>
                {['APY','Sharpe','Win Rate','Drawdown','Pf Factor'].map(m => (
                  <th key={m} style={{ padding:'0.4rem 0.5rem', fontSize:'0.6rem', color:'var(--text-muted)', fontWeight:600, textAlign:'center', textTransform:'uppercase', letterSpacing:'0.06em' }}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HEATMAP_AGENTS.map((a, i) => (
                <tr key={a}>
                  <td style={{ padding:'0.4rem 0.5rem', fontSize:'0.75rem', color:'var(--text-secondary)', fontWeight:600 }}>{a}</td>
                  {HEATMAP_DATA[i].map((v, j) => <HeatCell key={j} val={v} />)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Performing */}
        <div className="card" style={{ padding:'1.25rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1rem' }}>Top Performing Strategies</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {TOP_AGENTS.map((a, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem', borderRadius:'var(--r-lg)', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:`${a.color}15`, border:`1px solid ${a.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'0.75rem', color:a.color, fontFamily:'Outfit, sans-serif', flexShrink:0 }}>
                  {i + 1}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:'0.825rem', color:'var(--text-primary)', marginBottom:'0.1rem' }}>{a.name}</p>
                  <p style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{a.holders.toLocaleString()} investors · ${a.tvl}M TVL</p>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:900, color:a.color, fontFamily:'Outfit, sans-serif' }}>{a.apy}%</div>
                  <div style={{ fontSize:'0.65rem', color: a.trend === 'up' ? 'var(--green)' : 'var(--red)' }}>{a.change}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Capital Allocation */}
      <div className="card" style={{ padding:'1.25rem' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)' }}>Capital Allocation</h3>
          <button className="btn-ghost" style={{ fontSize:'0.72rem', height:28, padding:'0 0.625rem' }}>Rebalance</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'0.75rem' }}>
          {[
            { label:'Yield Farming', pct:42, color:'#3B82F6' },
            { label:'Volatility Surf', pct:28, color:'#8B5CF6' },
            { label:'LP Fees', pct:18, color:'#10B981' },
            { label:'Momentum', pct:12, color:'#F59E0B' },
          ].map(s => (
            <div key={s.label} style={{ padding:'0.875rem', background:'rgba(255,255,255,0.02)', borderRadius:'var(--r-lg)', border:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.625rem' }}>
                <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize:'0.875rem', fontWeight:800, color:s.color, fontFamily:'Outfit, sans-serif' }}>{s.pct}%</span>
              </div>
              <div className="progress-bar">
                <motion.div className={`progress-fill`} initial={{ width:0 }} animate={{ width:`${s.pct}%` }} transition={{ duration:1, delay:0.5, ease:'easeOut' }}
                  style={{ background:`linear-gradient(90deg, ${s.color}, ${s.color}aa)` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
