import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ChevronRight, Zap, Shield, Globe, ArrowUpRight, ExternalLink, Activity } from 'lucide-react';

function NeuralCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const nodes = Array.from({ length: 80 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 0.5,
      color: ['#3B82F6','#10B981','#8B5CF6','#06B6D4'][Math.floor(Math.random()*4)],
      pulse: Math.random() * Math.PI * 2,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.02;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 150) {
            const a = (1 - d/150) * 0.18;
            ctx.beginPath();
            const g = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            g.addColorStop(0, nodes[i].color + Math.floor(a*255).toString(16).padStart(2,'0'));
            g.addColorStop(1, nodes[j].color + Math.floor(a*255).toString(16).padStart(2,'0'));
            ctx.strokeStyle = g; ctx.lineWidth = 0.7;
            ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        const pr = n.r * (1 + 0.3 * Math.sin(n.pulse));
        ctx.beginPath(); ctx.arc(n.x, n.y, pr, 0, Math.PI*2);
        ctx.fillStyle = n.color; ctx.globalAlpha = 0.75; ctx.fill(); ctx.globalAlpha = 1;
        // glow
        const g2 = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, pr*4);
        g2.addColorStop(0, n.color + '30'); g2.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(n.x, n.y, pr*4, 0, Math.PI*2);
        ctx.fillStyle = g2; ctx.globalAlpha = 0.4; ctx.fill(); ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, opacity:0.5, pointerEvents:'none' }} />;
}

function AnimatedCounter({ target, decimals=0, prefix='', suffix='' }: { target:number; decimals?:number; prefix?:string; suffix?:string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0, steps = 80, step = 0;
    const t = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step/steps, 3);
      setVal(parseFloat((target * ease).toFixed(decimals)));
      if (step >= steps) clearInterval(t);
    }, 25);
    return () => clearInterval(t);
  }, [target]);
  return <>{prefix}{decimals ? val.toFixed(decimals) : val.toLocaleString()}{suffix}</>;
}

const METRICS = [
  { label:'Total Profit Generated', val:84.2, prefix:'$', suffix:'M', decimals:1, color:'var(--green-l)', note:'Demo' },
  { label:'Active Investors', val:12467, prefix:'', suffix:'', decimals:0, color:'var(--blue-l)', note:'Demo' },
  { label:'Live AI Agents', val:500, prefix:'', suffix:'+', decimals:0, color:'var(--purple-l)', note:'Demo' },
  { label:'Avg APY (Aave V3)', val:7.1, prefix:'', suffix:'%', decimals:1, color:'var(--gold-l)', note:'Real' },
];

const NODES = [
  { label:'Yield Harvester+ (Aave USDC)', val:'~8.2% APY', color:'#3B82F6', angle:0 },
  { label:'Volatility Surge (Aave WETH)',  val:'~3.1% APY', color:'#10B981', angle:60 },
  { label:'Arbitrage Master (Curve)',      val:'~6.8% APY', color:'#8B5CF6', angle:120 },
  { label:'Epsilon Core (Bred Agent)',     val:'~9.1% APY', color:'#F59E0B', angle:180 },
  { label:'Market Maker Pro (Uni V3)',     val:'~12.4% APY', color:'#06B6D4', angle:240 },
  { label:'Stablecoin Pro (Aave USDT)',    val:'~4.7% APY', color:'#10B981', angle:300 },
];

const NAV_MENUS = [
  {
    label: 'Products',
    items: [
      { label: 'AI Dashboard', desc: 'Bloomberg-grade overview', page: 'overview', icon: '📊' },
      { label: 'Agent Marketplace', desc: 'Browse 500+ AI hedge funds', page: 'marketplace', icon: '🛒' },
      { label: 'Strategy Hub', desc: 'Yield, arb, volatility & more', page: 'strategies', icon: '⚡' },
      { label: 'Breeding Lab', desc: 'Create superior AI offspring', page: 'breeding', icon: '🧬' },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { label: 'Browse Agents', desc: 'Explore all AI agents', page: 'marketplace', icon: '🤖' },
      { label: 'Leaderboard', desc: 'Top performing agents', page: 'leaderboard', icon: '🏆' },
      { label: 'Portfolio', desc: 'Your investments', page: 'portfolio', icon: '💼' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Analytics', desc: 'Platform performance data', page: 'analytics', icon: '📈' },
      { label: 'Cross-Chain', desc: 'Multi-chain operations', page: 'crosschain', icon: '🌐' },
      { label: 'Reputation', desc: 'Agent trust scores', page: 'reputation', icon: '🛡️' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About', desc: 'Built on 0G Network', page: null as string|null, icon: '🏛️', href: 'https://0g.ai' },
      { label: 'GitHub', desc: 'Open source code', page: null as string|null, icon: '💻', href: 'https://github.com/Maanyajha-12/AGENT-CAPITAL' },
      { label: 'Documentation', desc: 'Integration guides', page: null as string|null, icon: '📖', href: '#' },
    ],
  },
];

export default function LandingPage({ onLaunchApp }: { onLaunchApp: (page?:string)=>void }) {
  const [openMenu, setOpenMenu] = useState<string|null>(null);

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-void)', position:'relative', overflow:'hidden' }}>
      <NeuralCanvas />
      <div className="grid-overlay" />

      {/* Ambient orbs */}
      <div style={{ position:'absolute', top:-300, left:-200, width:800, height:800, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 65%)', filter:'blur(80px)', pointerEvents:'none' }} className="orb-anim" />
      <div style={{ position:'absolute', bottom:-200, right:-100, width:700, height:700, borderRadius:'50%', background:'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%)', filter:'blur(80px)', pointerEvents:'none', animationDelay:'-5s' }} className="orb-anim" />
      <div style={{ position:'absolute', top:'35%', left:'55%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)', filter:'blur(100px)', pointerEvents:'none', animationDelay:'-10s' }} className="orb-anim" />

      {/* Navbar */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:50, padding:'0 2.5rem', height:68, display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(6,7,10,0.65)', backdropFilter:'blur(24px)', borderBottom:'1px solid rgba(255,255,255,0.05)', boxShadow:'0 4px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#3B82F6,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 24px rgba(59,130,246,0.5)' }}>
            <TrendingUp size={18} color="#fff" />
          </div>
          <span style={{ fontSize:'1.05rem', fontWeight:900, color:'#F8FAFC', fontFamily:'Outfit, sans-serif', letterSpacing:'-0.02em' }}>
            AGENT <span className="gradient-text-blue">CAPITAL</span>
          </span>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'0.25rem' }} onMouseLeave={()=>setOpenMenu(null)}>
          {NAV_MENUS.map(menu => (
            <div key={menu.label} style={{ position:'relative' }}>
              <button
                onMouseEnter={()=>setOpenMenu(menu.label)}
                onClick={()=>setOpenMenu(openMenu===menu.label ? null : menu.label)}
                style={{ fontSize:'0.875rem', fontWeight:500, cursor:'pointer', background:'none', border:'none',
                  color: openMenu===menu.label ? '#F8FAFC' : 'var(--text-muted)',
                  padding:'0.5rem 0.875rem', borderRadius:8, transition:'all 0.15s',
                  display:'flex', alignItems:'center', gap:'0.3rem' }}>
                {menu.label}
                <svg width="10" height="10" viewBox="0 0 10 10" style={{ transition:'transform 0.2s', transform: openMenu===menu.label ? 'rotate(180deg)':'rotate(0)' }}>
                  <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
              </button>
              <AnimatePresence>
                {openMenu===menu.label && (
                  <motion.div initial={{ opacity:0, y:8, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4 }}
                    transition={{ duration:0.14 }}
                    style={{ position:'absolute', top:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)',
                      background:'rgba(8,12,24,0.98)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16,
                      padding:'0.5rem', minWidth:240, boxShadow:'0 24px 48px rgba(0,0,0,0.6)', backdropFilter:'blur(24px)', zIndex:200 }}>
                    {menu.items.map(item => (
                      <button key={item.label}
                        onClick={() => { setOpenMenu(null); if ((item as any).href) { window.open((item as any).href,'_blank'); return; } if (item.page) onLaunchApp(item.page); }}
                        style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.7rem 0.875rem',
                          borderRadius:10, background:'none', border:'none', cursor:'pointer', textAlign:'left' }}
                        onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.06)')}
                        onMouseLeave={e=>(e.currentTarget.style.background='none')}>
                        <span style={{ fontSize:'1.2rem' }}>{item.icon}</span>
                        <div>
                          <div style={{ fontSize:'0.84rem', fontWeight:700, color:'#F8FAFC' }}>{item.label}</div>
                          <div style={{ fontSize:'0.68rem', color:'#64748B' }}>{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={()=>onLaunchApp()} style={{ height:40, borderRadius:'var(--r-md)' }}>
          <Zap size={14} /> Connect Wallet
        </button>
      </nav>

      {/* Hero */}
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', position:'relative', zIndex:1, maxWidth:1320, margin:'0 auto', padding:'80px 2.5rem 3rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center', width:'100%' }}>

          {/* Left */}
          <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}>
            <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
              style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.35rem 1rem', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:99, marginBottom:'2rem' }}>
              <div className="live-dot" style={{ width:7, height:7, background:'var(--green)' }} />
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--green-l)', letterSpacing:'0.03em' }}>Live on 0G Galileo Testnet · Chain 16602 · 500+ Agents</span>
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3, duration:0.8 }}
              style={{ fontSize:'clamp(2.8rem,5vw,4.5rem)', fontWeight:900, fontFamily:'Outfit, sans-serif', lineHeight:1.02, letterSpacing:'-0.04em', marginBottom:'1.5rem' }}>
              <span style={{ color:'#F8FAFC' }}>Autonomous Asset</span><br />
              <span style={{ color:'#F8FAFC' }}>Management for</span><br />
              <span className="gradient-hero">the AI Era</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.45 }}
              style={{ fontSize:'1.05rem', color:'var(--text-muted)', lineHeight:1.8, marginBottom:'2.25rem', maxWidth:500 }}>
              AI agents generating real on-chain yield with verified execution powered by decentralized compute. Cryptographic proof on every trade.
            </motion.p>

            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.55 }}
              style={{ display:'flex', gap:'1rem', marginBottom:'3.5rem' }}>
              <button className="btn-primary" onClick={()=>onLaunchApp()}
                style={{ height:52, padding:'0 2rem', fontSize:'0.975rem', borderRadius:'var(--r-lg)', letterSpacing:'0.01em' }}>
                <Zap size={16} /> Launch App <ChevronRight size={15} />
              </button>
              <button className="btn-ghost" onClick={()=>onLaunchApp('marketplace')} style={{ height:52, padding:'0 1.75rem', fontSize:'0.975rem', borderRadius:'var(--r-lg)' }}>
                Explore Agents <ExternalLink size={14} />
              </button>
            </motion.div>

            {/* Metrics */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
              style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1rem' }}>
              {METRICS.map(m => (
                <div key={m.label} style={{ padding:'1.125rem 1.25rem', background:'rgba(255,255,255,0.025)', borderRadius:'var(--r-lg)', border:'1px solid rgba(255,255,255,0.06)', backdropFilter:'blur(12px)' }}>
                  <div style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit, sans-serif', color:m.color, lineHeight:1, marginBottom:'0.3rem' }}>
                    <AnimatedCounter target={m.val} prefix={m.prefix} suffix={m.suffix} decimals={m.decimals} />
                  </div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:500 }}>{m.label}</div>
                  <div style={{ fontSize:'0.62rem', marginTop:'0.15rem', fontWeight:600, color: (m as any).note === 'Real' ? '#10B981' : '#64748B' }}>
                    {(m as any).note === 'Real' ? '↑ Live from DeFi Llama API' : '↑ Platform demo data'}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Partners */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
              style={{ marginTop:'2.25rem', paddingTop:'1.75rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:'0.62rem', color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.875rem' }}>Powered by</p>
              <div style={{ display:'flex', gap:'1.25rem', alignItems:'center', flexWrap:'wrap', marginBottom:'0.875rem' }}>
                {['Ethereum','Arbitrum','Polygon'].map(p => (
                  <span key={p} style={{ fontSize:'0.825rem', fontWeight:700, color:'rgba(255,255,255,0.22)', letterSpacing:'0.05em', fontFamily:'Outfit, sans-serif' }}>{p}</span>
                ))}
                <a href="https://0g.ai" target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:'0.825rem', fontWeight:900, color:'#34D399', letterSpacing:'0.05em', fontFamily:'Outfit, sans-serif', textDecoration:'none' }}>0G Network ↗</a>
              </div>
              <a href="https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59"
                target="_blank" rel="noopener noreferrer"
                style={{ display:'inline-flex', alignItems:'center', gap:'0.375rem', fontSize:'0.62rem', color:'#475569', fontFamily:'monospace', textDecoration:'none', padding:'0.3rem 0.625rem', background:'rgba(16,185,129,0.06)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:8 }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:'#10B981', display:'inline-block' }} />
                Contract: 0x1cd62cb...2d59 on chainscan-galileo.0g.ai <ExternalLink size={10} />
              </a>
            </motion.div>
          </motion.div>

          {/* Right — orbital visualization */}
          <motion.div initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8, delay:0.2 }}
            style={{ position:'relative', height:600, display:'flex', alignItems:'center', justifyContent:'center' }}>

            {/* Outer ring */}
            <div style={{ position:'absolute', width:520, height:520, borderRadius:'50%', border:'1px solid rgba(59,130,246,0.1)', background:'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 70%)' }} />
            <div className="spin-slow" style={{ position:'absolute', width:480, height:480, borderRadius:'50%', border:'1px dashed rgba(59,130,246,0.15)' }} />
            <div style={{ position:'absolute', width:380, height:380, borderRadius:'50%', border:'1px solid rgba(139,92,246,0.08)' }} />

            {/* Center hub — shows real avg APY from Aave protocols */}
            <div style={{ position:'absolute', width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)', border:'1px solid rgba(59,130,246,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', zIndex:2, boxShadow:'0 0 60px rgba(59,130,246,0.25), 0 0 120px rgba(59,130,246,0.1)' }}>
              <div style={{ fontSize:'0.52rem', color:'var(--text-dim)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.15rem' }}>Aave V3 Avg</div>
              <div style={{ fontSize:'1.75rem', fontWeight:900, fontFamily:'Outfit, sans-serif', color:'var(--green-l)', lineHeight:1 }}>7.1%</div>
              <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.12em', marginTop:'0.2rem' }}>Real APY</div>
            </div>

            {/* Orbiting agent nodes */}
            {NODES.map((node, i) => {
              const rad = (node.angle * Math.PI) / 180;
              const r = 230;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <motion.div key={i}
                  animate={{ x:[x,x+8,x], y:[y,y-5,y] }}
                  transition={{ duration:4+i*0.7, repeat:Infinity, ease:'easeInOut', delay:i*0.5 }}
                  style={{ position:'absolute', top:'50%', left:'50%',
                    transform:`translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    background:'rgba(8,12,24,0.95)', border:`1px solid ${node.color}35`,
                    borderRadius:'var(--r-lg)', padding:'0.625rem 0.875rem', whiteSpace:'nowrap',
                    boxShadow:`0 0 24px ${node.color}20, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    backdropFilter:'blur(12px)', zIndex:2 }}>
                  <div style={{ fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', marginBottom:'0.15rem' }}>{node.label}</div>
                  <div style={{ fontSize:'0.95rem', fontWeight:900, color:node.color, fontFamily:'Outfit, sans-serif' }}>{node.val}</div>
                </motion.div>
              );
            })}

            {/* Connection lines */}
            <svg style={{ position:'absolute', width:'100%', height:'100%', pointerEvents:'none', zIndex:1 }}>
              {NODES.map((node, i) => {
                const rad = (node.angle * Math.PI) / 180;
                const r = 230;
                const cx = 50, cy = 50;
                const x = cx + (Math.cos(rad) * r / 6);
                const y = cy + (Math.sin(rad) * r / 6);
                return (
                  <motion.line key={i}
                    x1={`${cx}%`} y1={`${cy}%`} x2={`${x}%`} y2={`${y}%`}
                    stroke={node.color} strokeWidth="0.5" strokeOpacity="0.25"
                    animate={{ strokeOpacity:[0.1,0.35,0.1] }}
                    transition={{ duration:3, repeat:Infinity, delay:i*0.5 }}
                  />
                );
              })}
            </svg>

            {/* Floating profit cards */}
            <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut' }}
              style={{ position:'absolute', bottom:60, right:20, padding:'1rem 1.375rem', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.25)', borderRadius:'var(--r-xl)', backdropFilter:'blur(16px)', boxShadow:'0 0 30px rgba(16,185,129,0.15)', zIndex:3 }}>
              <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginBottom:'0.25rem', fontWeight:600 }}>Today's Profit</div>
              <div style={{ fontSize:'1.5rem', fontWeight:900, color:'var(--green)', fontFamily:'Outfit, sans-serif' }}>+$54,720</div>
              <div style={{ fontSize:'0.62rem', color:'var(--green-l)', marginTop:'0.15rem' }}>↑ +3.2% vs yesterday</div>
            </motion.div>

            <motion.div animate={{ y:[0,8,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut', delay:1 }}
              style={{ position:'absolute', top:70, right:40, padding:'1rem 1.375rem', background:'rgba(59,130,246,0.08)', border:'1px solid rgba(59,130,246,0.25)', borderRadius:'var(--r-xl)', backdropFilter:'blur(16px)', boxShadow:'0 0 30px rgba(59,130,246,0.15)', zIndex:3 }}>
              <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginBottom:'0.25rem', fontWeight:600 }}>Total Profit</div>
              <div style={{ fontSize:'1.5rem', fontWeight:900, color:'var(--blue-l)', fontFamily:'Outfit, sans-serif' }}>$84.2M</div>
              <div style={{ fontSize:'0.62rem', color:'var(--blue-l)', marginTop:'0.15rem' }}>↑ +23% this month</div>
            </motion.div>

            <motion.div animate={{ y:[0,-6,0] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut', delay:2 }}
              style={{ position:'absolute', top:'40%', left:-10, padding:'0.875rem 1.125rem', background:'rgba(139,92,246,0.08)', border:'1px solid rgba(139,92,246,0.25)', borderRadius:'var(--r-xl)', backdropFilter:'blur(16px)', boxShadow:'0 0 30px rgba(139,92,246,0.15)', zIndex:3 }}>
              <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', marginBottom:'0.2rem' }}>Agents Breeding</div>
              <div style={{ fontSize:'1.25rem', fontWeight:900, color:'var(--purple-l)', fontFamily:'Outfit, sans-serif' }}>47 Active</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Feature strip */}
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:1.1 }}
        style={{ position:'relative', zIndex:1, background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'2rem 0' }}>
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 2.5rem', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2rem' }}>
          {[
            { icon: Shield, color:'var(--blue-l)', title:'Verified Execution', desc:'Every trade has a cryptographic 0G Compute proof hash' },
            { icon: Activity, color:'var(--green-l)', title:'Real On-Chain Yield', desc:'Actual DeFi profits, not tokenomics or fake APY' },
            { icon: Globe, color:'var(--purple-l)', title:'Cross-Chain', desc:'Operates on ETH, Arbitrum, Polygon, Base & 0G Chain' },
            { icon: TrendingUp, color:'var(--gold-l)', title:'Institutional Grade', desc:'Sharpe ratios, drawdown controls, insurance products' },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
              <div style={{ width:40, height:40, borderRadius:12, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div style={{ fontSize:'0.875rem', fontWeight:700, color:'var(--text-primary)', marginBottom:'0.25rem' }}>{title}</div>
                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', lineHeight:1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
