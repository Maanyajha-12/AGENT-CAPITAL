import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Trophy, Zap, TrendingUp, CheckCircle, Award, Globe, Activity } from 'lucide-react';

const BADGES = [
  { icon:'🏛️', title:'Institutional Grade', desc:'Meets institutional risk standards', color:'#F59E0B', rarity:'Legendary', earned:true },
  { icon:'⚡', title:'Risk Master', desc:'Exceptional risk management score', color:'#3B82F6', rarity:'Epic', earned:true },
  { icon:'🔥', title:'Trending', desc:'Top 5% performance this week', color:'#EF4444', rarity:'Rare', earned:true },
  { icon:'💎', title:'Elite Alpha', desc:'Top 1% yield generation', color:'#8B5CF6', rarity:'Legendary', earned:true },
  { icon:'🌾', title:'Stable Yield King', desc:'12 months of consistent returns', color:'#10B981', rarity:'Epic', earned:true },
  { icon:'🌐', title:'Cross-Chain Pioneer', desc:'Active on 5+ chains', color:'#06B6D4', rarity:'Rare', earned:false },
  { icon:'🧬', title:'Breeding Master', desc:'10+ successful offspring', color:'#A78BFA', rarity:'Epic', earned:false },
  { icon:'📊', title:'Quant Expert', desc:'Advanced analytics certification', color:'#FCD34D', rarity:'Rare', earned:false },
];

const TRUST_METRICS = [
  { label:'Execution Accuracy', val:98.7, color:'#10B981' },
  { label:'Risk Adherence', val:96.2, color:'#3B82F6' },
  { label:'Transparency Score', val:99.1, color:'#8B5CF6' },
  { label:'Community Trust', val:94.8, color:'#F59E0B' },
];

const REVIEWS = [
  { user:'0xInstitutional', rating:5, text:'Best performing agent I\'ve used. Institutional-grade risk management with retail-friendly UX. Absolutely exceptional.', time:'2h ago' },
  { user:'CryptoCapital.eth', rating:5, text:'$140K deployed. Zero issues. 87% APY as advertised. The 0G proof verification gives me complete confidence.', time:'1d ago' },
  { user:'YieldMaxi', rating:4, text:'Consistent returns every single week. Auto-compound feature saves a ton of gas fees. Highly recommend.', time:'3d ago' },
];

export default function ReputationPage() {
  const [tab, setTab] = useState<'overview'|'badges'|'reviews'>('overview');
  const score = 94;
  const fadeIn = (i:number) => ({ initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{delay:i*0.07} });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.375rem' }}>
      <motion.div {...fadeIn(0)}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'0.3rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#F59E0B,#EF4444)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(245,158,11,0.4)' }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Agent Reputation System</h1>
            <p style={{ fontSize:'0.825rem', color:'var(--text-muted)' }}>On-chain verified reputation and trust metrics</p>
          </div>
        </div>
      </motion.div>

      {/* Hero score card */}
      <motion.div {...fadeIn(1)} className="card" style={{ padding:'2rem', background:'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(239,68,68,0.04))', borderColor:'rgba(245,158,11,0.2)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:'2.5rem', alignItems:'center' }}>
          {/* Score circle */}
          <div style={{ position:'relative', width:140, height:140 }}>
            <svg width="140" height="140" style={{ position:'absolute', top:0, left:0 }}>
              <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="8" />
              <circle cx="70" cy="70" r="60" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                strokeDasharray={`${score/100*377} 377`} strokeLinecap="round" transform="rotate(-90 70 70)" />
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontSize:'2.25rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--gold-l)', lineHeight:1 }}>{score}</div>
              <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Score</div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
              <h2 style={{ fontSize:'1.5rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)' }}>Yield Harvester+</h2>
              <span className="badge badge-gold">Institutional Grade</span>
            </div>
            <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'1.25rem' }}>Gen-3 Verified Agent · Active 14 months · $84M+ total volume traded</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem' }}>
              {[['Total Trades','1,247'],['Win Rate','71.3%'],['Profit Factor','2.8x'],['Days Active','0']].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.2rem' }}>{l}</div>
                  <div style={{ fontSize:'1.125rem', fontWeight:900, color:'var(--text-primary)', fontFamily:'Outfit,sans-serif' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust indicators */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {[['0G Verified','#10B981'],['Chainlink Audited','#3B82F6'],['Risk Compliant','#8B5CF6']].map(([l,c])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 0.875rem', borderRadius:'var(--r-full)', background:`${c}10`, border:`1px solid ${c}25` }}>
                <CheckCircle size={13} style={{ color:c }} />
                <span style={{ fontSize:'0.75rem', fontWeight:700, color:c }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Trust metrics */}
      <motion.div {...fadeIn(2)} className="card" style={{ padding:'1.375rem' }}>
        <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.25rem' }}>Trust Metrics</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.25rem' }}>
          {TRUST_METRICS.map((m,i)=>(
            <div key={m.label}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:500 }}>{m.label}</span>
                <span style={{ fontSize:'0.875rem', fontWeight:800, color:m.color, fontFamily:'Outfit,sans-serif' }}>{m.val}%</span>
              </div>
              <div className="progress-bar" style={{ height:6 }}>
                <motion.div className="progress-fill" initial={{ width:0 }} animate={{ width:`${m.val}%` }} transition={{ duration:1.2, delay:0.3+i*0.1, ease:[0.34,1.56,0.64,1] }}
                  style={{ background:`linear-gradient(90deg, ${m.color}, ${m.color}cc)`, boxShadow:`0 0 10px ${m.color}50`, height:'100%', borderRadius:99 }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div {...fadeIn(3)} className="card" style={{ padding:'1.375rem' }}>
        <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.25rem' }}>Achievement Badges</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'0.875rem' }}>
          {BADGES.map((b,i)=>(
            <motion.div key={b.title} whileHover={b.earned?{ y:-3, scale:1.02 }:{}}
              style={{ padding:'1.125rem', borderRadius:'var(--r-xl)', border:`1px solid ${b.earned?b.color+'35':'rgba(255,255,255,0.04)'}`, background:b.earned?`${b.color}08`:'rgba(255,255,255,0.015)', cursor:b.earned?'pointer':'default', opacity:b.earned?1:0.4, transition:'all 0.2s', position:'relative', overflow:'hidden' }}>
              {b.earned && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${b.color}, transparent)` }} />}
              <div style={{ fontSize:'2rem', marginBottom:'0.625rem' }}>{b.icon}</div>
              <div style={{ fontWeight:800, fontSize:'0.85rem', color:b.earned?'var(--text-primary)':'var(--text-muted)', marginBottom:'0.2rem' }}>{b.title}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'0.625rem', lineHeight:1.4 }}>{b.desc}</div>
              <span style={{ padding:'0.15rem 0.5rem', borderRadius:99, fontSize:'0.6rem', fontWeight:700, background:`${b.color}15`, color:b.color, border:`1px solid ${b.color}25` }}>{b.rarity}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Community Reviews */}
      <motion.div {...fadeIn(4)} className="card" style={{ padding:'1.375rem' }}>
        <h3 style={{ fontSize:'0.9rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1.25rem' }}>Community Reviews</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {REVIEWS.map((r,i)=>(
            <div key={i} style={{ padding:'1rem', borderRadius:'var(--r-lg)', background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.625rem' }}>
                <div>
                  <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'0.875rem', marginBottom:'0.25rem' }}>{r.user}</div>
                  <div style={{ display:'flex', gap:'0.2rem' }}>
                    {Array.from({length:5},(_,j)=><Star key={j} size={11} fill={j<r.rating?'#F59E0B':'none'} style={{ color:'#F59E0B' }} />)}
                  </div>
                </div>
                <span style={{ fontSize:'0.65rem', color:'var(--text-dim)' }}>{r.time}</span>
              </div>
              <p style={{ fontSize:'0.8rem', color:'var(--text-secondary)', lineHeight:1.6 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
