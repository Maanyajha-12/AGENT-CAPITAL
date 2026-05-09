import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, CheckCircle, Star, Sparkles, Zap, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const AGENTS = [
  { id:1, name:'Yield Harvester+', gen:3, apy:87.3, winRate:71.3, sharpe:1.94, color:'#3B82F6', verified:true, rarity:'Legendary' },
  { id:2, name:'Volatility Surge',  gen:2, apy:76.1, winRate:68.5, sharpe:1.67, color:'#8B5CF6', verified:true, rarity:'Rare' },
  { id:3, name:'Arbitrage Master',  gen:1, apy:72.8, winRate:74.2, sharpe:1.52, color:'#F59E0B', verified:true, rarity:'Rare' },
  { id:4, name:'Stablecoin Pro',    gen:0, apy:48.2, winRate:89.1, sharpe:1.34, color:'#10B981', verified:true, rarity:'Common' },
  { id:5, name:'Epsilon Core',      gen:4, apy:95.0, winRate:78.4, sharpe:2.01, color:'#EF4444', verified:true, rarity:'Legendary' },
  { id:6, name:'Market Maker Pro',  gen:1, apy:61.4, winRate:63.2, sharpe:1.28, color:'#06B6D4', verified:false, rarity:'Common' },
];
const GEN_DATA = [
  {gen:'G0',apy:60},{gen:'G1',apy:75},{gen:'G2',apy:85},{gen:'G3',apy:92},{gen:'G4',apy:97},{gen:'G5+',apy:104},
];
const rarityColor:Record<string,string> = { Common:'#64748B', Rare:'#8B5CF6', Legendary:'#F59E0B' };

function DNACanvas({ active, c1, c2 }: { active:boolean; c1:string; c2:string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    canvas.width = 300; canvas.height = 220;
    let t = 0;
    const draw = () => {
      ctx.clearRect(0,0,300,220);
      if (active) {
        const w=300,h=220;
        // Helix strands
        for (let x=0;x<w;x+=3) {
          const prog = x/w;
          const amp = 38*(1-Math.abs(prog-0.5)*1.6);
          const y1 = h/2 + amp*Math.sin(x/35+t);
          const y2 = h/2 - amp*Math.sin(x/35+t);
          ctx.beginPath(); ctx.arc(x,y1,2.5,0,Math.PI*2);
          ctx.fillStyle=c1+'CC'; ctx.fill();
          ctx.beginPath(); ctx.arc(x,y2,2.5,0,Math.PI*2);
          ctx.fillStyle=c2+'CC'; ctx.fill();
          if (x%22===0) {
            const g=ctx.createLinearGradient(x,y2,x,y1);
            g.addColorStop(0,c1+'70'); g.addColorStop(1,c2+'70');
            ctx.beginPath(); ctx.moveTo(x,y2); ctx.lineTo(x,y1);
            ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();
          }
        }
        // Particles
        for (let i=0;i<8;i++) {
          const px=w/2+Math.sin(t*2+i*0.78)*70;
          const py=h/2+Math.cos(t*1.5+i*0.9)*28;
          ctx.beginPath(); ctx.arc(px,py,3.5,0,Math.PI*2);
          ctx.fillStyle=i%2===0?c1:c2; ctx.globalAlpha=0.85; ctx.fill(); ctx.globalAlpha=1;
        }
        // Center glow
        const rg=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,50);
        rg.addColorStop(0,'rgba(255,255,255,0.1)'); rg.addColorStop(1,'transparent');
        ctx.fillStyle=rg; ctx.fillRect(0,0,w,h);
        t+=0.055;
      }
      rafRef.current=requestAnimationFrame(draw);
    };
    draw();
    return ()=>cancelAnimationFrame(rafRef.current);
  },[active,c1,c2]);
  return <canvas ref={ref} style={{ width:300,height:220,borderRadius:16,opacity:active?1:0.25,transition:'opacity 0.5s',display:'block',margin:'0 auto' }} />;
}

function ChildPreview({ p1, p2 }: { p1:typeof AGENTS[0]; p2:typeof AGENTS[0] }) {
  const [step,setStep]=useState(0);
  const childApy=Math.round((p1.apy+p2.apy)/2*1.08*10)/10;
  const childSharpe=((p1.sharpe+p2.sharpe)/2*1.05).toFixed(2);
  const childGen=Math.max(p1.gen,p2.gen)+1;
  const childRarity=p1.rarity==='Legendary'||p2.rarity==='Legendary'?'Legendary':p1.rarity==='Rare'||p2.rarity==='Rare'?'Rare':'Common';
  const steps=['Analyzing genetic code...','Fusing strategies...','Applying mutation bonus...','Child agent ready!'];
  useEffect(()=>{ if(step<3){const t=setTimeout(()=>setStep(s=>s+1),900);return()=>clearTimeout(t);} },[step]);
  const col=rarityColor[childRarity];
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      style={{ background:'rgba(8,12,24,0.97)', border:`1px solid ${col}30`, borderRadius:20, padding:'1.5rem' }}>
      <h3 style={{ fontSize:'0.95rem', fontWeight:800, color:'#F8FAFC', marginBottom:'1.25rem', textAlign:'center', fontFamily:'Outfit,sans-serif' }}>🧬 Breeding Synthesis</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.25rem' }}>
        {steps.map((s,i)=>(
          <motion.div key={i} animate={{ opacity:step>=i?1:0.3 }}
            style={{ display:'flex', alignItems:'center', gap:'0.625rem', padding:'0.5rem 0.875rem', borderRadius:10, background:step>i?'rgba(16,185,129,0.08)':'rgba(255,255,255,0.02)', border:step>i?'1px solid rgba(16,185,129,0.2)':'1px solid transparent' }}>
            {step>i
              ? <CheckCircle size={14} style={{ color:'#10B981', flexShrink:0 }} />
              : step===i ? <div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid var(--blue)',borderTopColor:'transparent',animation:'spin 0.8s linear infinite',flexShrink:0 }} />
              : <div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.1)',flexShrink:0 }} />}
            <span style={{ fontSize:'0.8rem', color:step>i?'#34D399':'#64748B', fontWeight:step>i?600:400 }}>{s}</span>
          </motion.div>
        ))}
      </div>
      {step>=3&&(
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          style={{ background:`linear-gradient(135deg, ${col}10, rgba(59,130,246,0.06))`, border:`1px solid ${col}35`, borderRadius:16, padding:'1.375rem', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem', padding:'0.25rem 0.875rem', background:`${col}18`, border:`1px solid ${col}35`, borderRadius:99, marginBottom:'1rem' }}>
            <Star size={11} style={{ color:col }} />
            <span style={{ fontSize:'0.65rem', fontWeight:800, color:col, letterSpacing:'0.08em', textTransform:'uppercase' }}>{childRarity}</span>
          </div>
          <div style={{ fontWeight:900, fontSize:'1.125rem', color:'#F8FAFC', fontFamily:'Outfit,sans-serif', marginBottom:'0.25rem' }}>Hybrid Alpha — Gen {childGen}</div>
          <div style={{ fontSize:'0.72rem', color:'#64748B', marginBottom:'1.25rem' }}>Inherits {p1.name.split(' ')[0]} + {p2.name.split(' ')[0]} genetics</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.875rem', marginBottom:'1rem' }}>
            {[['APY',`${childApy}%`,col],['Sharpe',childSharpe,'#3B82F6'],['Gen',childGen,'#8B5CF6']].map(([l,v,c])=>(
              <div key={l as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:10, padding:'0.625rem' }}>
                <div style={{ fontSize:'1.75rem', fontWeight:900, color:c as string, fontFamily:'Outfit,sans-serif', lineHeight:1, marginBottom:'0.2rem' }}>{v}</div>
                <div style={{ fontSize:'0.6rem', color:'#64748B', textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'0.625rem', background:'rgba(245,158,11,0.08)', borderRadius:10, border:'1px solid rgba(245,158,11,0.15)' }}>
            <span style={{ fontSize:'0.72rem', color:'var(--gold-l)', fontWeight:700 }}>✦ Mutation bonus: +{childRarity==='Legendary'?'12':'7'}% performance uplift applied</span>
          </div>
          <button className="btn-primary" style={{ width:'100%', marginTop:'1rem', height:44 }}>
            <Sparkles size={15} /> Mint Child Agent
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function BreedingLab() {
  const [p1,setP1]=useState<typeof AGENTS[0]|null>(null);
  const [p2,setP2]=useState<typeof AGENTS[0]|null>(null);
  const [bred,setBred]=useState(false);
  const [showChild,setShowChild]=useState(false);
  const canBreed=p1&&p2;

  const select=(a:typeof AGENTS[0])=>{
    if(!p1){setP1(a);setBred(false);setShowChild(false);return;}
    if(!p2&&a.id!==p1.id){setP2(a);return;}
    if(a.id===p1.id){setP1(null);return;}
    if(a.id===p2?.id){setP2(null);return;}
  };
  const breed=()=>{ if(!canBreed)return; setBred(true); setTimeout(()=>setShowChild(true),400); };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.375rem' }}>
      <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'0.3rem' }}>
          <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#8B5CF6,#3B82F6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(139,92,246,0.45)' }}>
            <Dna size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit,sans-serif', color:'var(--text-primary)', letterSpacing:'-0.02em' }}>Breeding Lab</h1>
            <p style={{ fontSize:'0.825rem', color:'var(--text-muted)' }}>Combine high-performing agents to create superior offspring</p>
          </div>
        </div>
      </motion.div>

      {/* Main breeding interface */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px 1fr', gap:'1.25rem', alignItems:'start' }}>
        {/* Parent A */}
        {[{label:'Parent Agent A',parent:p1,isA:true},{label:'Parent Agent B',parent:p2,isA:false}].map(({label,parent,isA},pi)=>(
          <div key={label} className="card" style={{ padding:'1.375rem', border:parent?`1px solid ${parent.color}40`:'1px solid rgba(255,255,255,0.07)', boxShadow:parent?`0 0 30px ${parent.color}15`:'none', transition:'all 0.3s', ...(pi===1?{}:{}) }}>
            <p style={{ fontSize:'0.62rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.875rem' }}>{label}</p>
            {parent?(
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.125rem' }}>
                  <div style={{ width:48, height:48, borderRadius:14, background:`${parent.color}20`, border:`2px solid ${parent.color}40`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', fontWeight:900, color:parent.color, fontFamily:'Outfit,sans-serif', boxShadow:`0 0 20px ${parent.color}25` }}>{parent.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:800, color:'var(--text-primary)', fontSize:'0.95rem' }}>{parent.name}</div>
                    <div style={{ fontSize:'0.65rem', color:rarityColor[parent.rarity], fontWeight:700 }}>Gen {parent.gen} · {parent.rarity}</div>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem', marginBottom:'0.875rem' }}>
                  {[['APY',`${parent.apy}%`,parent.color],['Win Rate',`${parent.winRate}%`,'#3B82F6'],['Sharpe',parent.sharpe,'#8B5CF6'],['Gen',`Gen ${parent.gen}`,'#F59E0B']].map(([l,v,c])=>(
                    <div key={l as string} style={{ background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'0.5rem 0.625rem' }}>
                      <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{l}</div>
                      <div style={{ fontSize:'0.9rem', fontWeight:800, color:c as string, fontFamily:'Outfit,sans-serif' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>isA?setP1(null):setP2(null)} style={{ width:'100%', padding:'0.4rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:8, color:'var(--red-l)', fontSize:'0.72rem', cursor:'pointer', fontWeight:600 }}>Remove</button>
              </motion.div>
            ):(
              <div style={{ height:130, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', border:'2px dashed rgba(255,255,255,0.07)', borderRadius:14 }}>
                <Dna size={26} style={{ color:'#334155', marginBottom:'0.625rem' }} />
                <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', textAlign:'center' }}>Select from agents below</p>
              </div>
            )}
          </div>
        ))}

        {/* Center — DNA + Breed */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
          <div className="card" style={{ padding:'1rem', width:'100%', textAlign:'center', border:canBreed?'1px solid rgba(139,92,246,0.3)':'1px solid rgba(255,255,255,0.07)' }}>
            <DNACanvas active={!!canBreed} c1={p1?.color||'#3B82F6'} c2={p2?.color||'#8B5CF6'} />
          </div>
          <motion.button onClick={breed} disabled={!canBreed}
            whileHover={canBreed?{ scale:1.03 }:{}} whileTap={canBreed?{ scale:0.97 }:{}}
            style={{ width:'100%', padding:'0.875rem', borderRadius:14, border:'none', cursor:canBreed?'pointer':'not-allowed',
              background:canBreed?'linear-gradient(135deg,#8B5CF6,#3B82F6)':'rgba(255,255,255,0.04)',
              color:canBreed?'#fff':'#334155', fontWeight:800, fontSize:'0.95rem', fontFamily:'Outfit,sans-serif',
              boxShadow:canBreed?'0 0 32px rgba(139,92,246,0.45), 0 0 60px rgba(59,130,246,0.2)':'none',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', transition:'all 0.2s' }}>
            <Dna size={16} />{bred?'✓ Bred!':'Breed Agents'}
          </motion.button>
          <p style={{ fontSize:'0.65rem', color:'var(--text-dim)', textAlign:'center' }}>0.5 0G token fee · Royalties to parent creators</p>
        </div>
      </div>

      {/* Child preview */}
      <AnimatePresence>{showChild&&p1&&p2&&<ChildPreview p1={p1} p2={p2} />}</AnimatePresence>

      {/* Gen chart + Agent selector */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1.25rem', alignItems:'start' }}>
        <div className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.2rem' }}>Generational Improvement</h3>
          <p style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginBottom:'1rem' }}>Each generation outperforms the last</p>
          <div style={{ height:150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={GEN_DATA}>
                <XAxis dataKey="gen" tick={{ fontSize:10, fill:'#475569' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:'#475569' }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip contentStyle={{ background:'rgba(8,12,24,0.97)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, fontSize:12 }} formatter={(v:any)=>[`${v}%`,'Avg APY']} />
                <Bar dataKey="apy" fill="#8B5CF6" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding:'1.375rem' }}>
          <h3 style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'1rem' }}>Select Agents to Breed</h3>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'0.75rem' }}>
            {AGENTS.map(a=>{
              const isP1=p1?.id===a.id, isP2=p2?.id===a.id, sel=isP1||isP2;
              return (
                <motion.div key={a.id} whileHover={{ y:-2 }} onClick={()=>select(a)}
                  style={{ padding:'0.875rem', borderRadius:12, cursor:'pointer',
                    background:sel?`${a.color}12`:'rgba(255,255,255,0.025)',
                    border:sel?`1px solid ${a.color}45`:'1px solid rgba(255,255,255,0.05)',
                    boxShadow:sel?`0 0 20px ${a.color}18`:'none', transition:'all 0.2s' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.375rem' }}>
                      <span style={{ fontSize:'0.58rem', fontWeight:700, padding:'0.15rem 0.4rem', borderRadius:99, background:`${a.color}20`, color:a.color, border:`1px solid ${a.color}30` }}>Gen {a.gen}</span>
                      {a.verified&&<CheckCircle size={11} style={{ color:'#10B981' }} />}
                    </div>
                    {sel&&<span style={{ fontSize:'0.65rem', fontWeight:900, color:isP1?'#3B82F6':'#8B5CF6', background:isP1?'rgba(59,130,246,0.15)':'rgba(139,92,246,0.15)', padding:'0.1rem 0.4rem', borderRadius:99 }}>{isP1?'A':'B'}</span>}
                  </div>
                  <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'0.825rem', marginBottom:'0.25rem' }}>{a.name}</div>
                  <div style={{ fontSize:'0.875rem', fontWeight:900, color:a.color, fontFamily:'Outfit,sans-serif' }}>{a.apy}% APY</div>
                  <div style={{ fontSize:'0.62rem', color:rarityColor[a.rarity], fontWeight:700, marginTop:'0.2rem' }}>{a.rarity}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
