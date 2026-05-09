import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, BarChart3, Zap, Shield, Globe } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const MONTHLY = [
  {m:'Oct',revenue:180,profit:144,agents:320},{m:'Nov',revenue:240,profit:192,agents:360},
  {m:'Dec',revenue:310,profit:248,agents:400},{m:'Jan',revenue:280,profit:224,agents:420},
  {m:'Feb',revenue:390,profit:312,agents:445},{m:'Mar',revenue:450,profit:360,agents:470},
  {m:'Apr',revenue:520,profit:416,agents:490},{m:'May',revenue:580,profit:464,agents:512},
];
const RADAR_DATA = [
  {metric:'APY',val:87},{metric:'Sharpe',val:78},{metric:'Win Rate',val:71},
  {metric:'Stability',val:82},{metric:'Volume',val:95},{metric:'Safety',val:88},
];
const RISK_DATA = [
  {range:'<10%',count:18},{range:'10-20%',count:42},{range:'20-30%',count:31},{range:'30-40%',count:6},{range:'>40%',count:3},
];

export default function SystemStats() {
  const [liveMetrics, setLiveMetrics] = useState({ tps:247, latency:0.8, uptime:99.97 });
  useEffect(()=>{
    const t=setInterval(()=>{
      setLiveMetrics(m=>({ tps:Math.round(m.tps+(Math.random()-0.4)*10), latency:parseFloat((m.latency+(Math.random()-0.5)*0.05).toFixed(2)), uptime:99.97 }));
    },2500);
    return ()=>clearInterval(t);
  },[]);
  const fadeIn=(i:number)=>({initial:{opacity:0,y:16},animate:{opacity:1,y:0},transition:{delay:i*0.07}});

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.375rem' }}>
      <motion.div {...fadeIn(0)}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'0.3rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#06B6D4,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(6,182,212,0.4)' }}>
            <BarChart3 size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Platform Analytics</h1>
            <p style={{ fontSize:'0.825rem', color:'var(--text-muted)' }}>Real-time performance metrics and system health</p>
          </div>
        </div>
      </motion.div>

      {/* Live system metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
        {[
          { label:'Trades/Second', val:liveMetrics.tps, unit:'TPS', color:'#3B82F6', icon:Activity },
          { label:'Avg Latency', val:liveMetrics.latency, unit:'s', color:'#10B981', icon:Zap },
          { label:'Platform Uptime', val:liveMetrics.uptime, unit:'%', color:'#F59E0B', icon:Shield },
        ].map(({label,val,unit,color,icon:Icon})=>(
          <motion.div key={label} {...fadeIn(1)} className="metric-card" style={{ borderTop:`2px solid ${color}35` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.875rem' }}>
              <span className="metric-label">{label}</span>
              <div style={{ width:32, height:32, borderRadius:9, background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Icon size={14} style={{ color }} />
              </div>
            </div>
            <div style={{ fontSize:'2rem', fontWeight:900, color, fontFamily:'Outfit,sans-serif' }}>{val}{unit}</div>
            <div className="metric-change up"><div className="live-dot" style={{ width:5, height:5, background:'var(--green)', marginRight:'0.25rem' }} />Live</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue + Agent growth */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'1.25rem' }}>
        <motion.div {...fadeIn(2)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Revenue & Profit</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Platform revenue vs profit (in $K)</p>
          <div style={{ height:220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY}>
                <defs>
                  <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} unit="K" />
                <Tooltip contentStyle={{ background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:12 }} />
                <Bar dataKey="revenue" fill="url(#gRev)" radius={[4,4,0,0]} name="Revenue" />
                <Bar dataKey="profit" fill="url(#gProfit)" radius={[4,4,0,0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeIn(3)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Performance Radar</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'0.5rem' }}>Top agent composite scores</p>
          <div style={{ height:230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize:10, fill:'#64748B' }} />
                <PolarRadiusAxis angle={30} domain={[0,100]} tick={{ fontSize:9, fill:'#334155' }} />
                <Radar dataKey="val" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Agent growth + Risk distribution */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <motion.div {...fadeIn(4)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Agent Growth</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Total active agents on platform</p>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="gAgent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="m" tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:12 }} />
                <Area type="monotone" dataKey="agents" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#gAgent)" dot={false} name="Agents" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div {...fadeIn(5)} className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Drawdown Distribution</h3>
          <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Max drawdown across all agents</p>
          <div style={{ height:200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RISK_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="range" tick={{ fontSize:10, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'#475569' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, fontSize:12 }} />
                <Bar dataKey="count" fill="#10B981" radius={[4,4,0,0]} name="Agents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* System health grid */}
      <motion.div {...fadeIn(6)} className="card" style={{ padding:'1.375rem' }}>
        <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.25rem' }}>System Health</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
          {[
            { label:'0G Compute', status:'Operational', color:'#10B981', latency:'0.8s' },
            { label:'Chainlink Oracle', status:'Operational', color:'#10B981', latency:'1.2s' },
            { label:'Smart Contracts', status:'Operational', color:'#10B981', latency:'12s' },
            { label:'Risk Engine', status:'Operational', color:'#10B981', latency:'0.3s' },
          ].map(s=>(
            <div key={s.label} style={{ padding:'1rem', background:'rgba(16,185,129,0.05)', borderRadius:'var(--r-lg)', border:'1px solid rgba(16,185,129,0.15)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
                <div className="live-dot" style={{ width:7, height:7, background:s.color }} />
                <span style={{ fontSize:'0.72rem', fontWeight:700, color:s.color }}>{s.status}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:'0.825rem', color:'var(--text-primary)', marginBottom:'0.2rem' }}>{s.label}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>Latency: {s.latency}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
