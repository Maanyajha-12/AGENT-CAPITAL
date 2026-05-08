import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ExternalLink, ChevronRight, Zap, Shield } from 'lucide-react';

const STATS = [
  { label: 'Total Profit Generated', val: '$84.2M', change: '+23% this month', up: true },
  { label: 'Active Investors',        val: '12,467', change: '+22% this month', up: true },
  { label: 'Live AI Agents',          val: '500+',   change: '+45 this week',  up: true },
  { label: 'Average APY',             val: '60.2%',  change: '+3.4% this month', up: true },
];

const PARTNERS = ['0G', 'Chainlink', 'Polygon', 'Arbitrum', 'Ethereum'];

function NeuralCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const nodes = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2.5 + 1,
      color: Math.random() > 0.5 ? '#3B82F6' : Math.random() > 0.5 ? '#10B981' : '#8B5CF6',
    }));

    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, opacity: 0.45, pointerEvents: 'none' }} />;
}

export default function LandingPage({ onLaunchApp }: { onLaunchApp: () => void }) {
  const [counters, setCounters] = useState({ profit: 0, investors: 0, agents: 0, apy: 0 });

  useEffect(() => {
    const targets = { profit: 84.2, investors: 12467, agents: 500, apy: 60.2 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounters({
        profit: parseFloat((targets.profit * ease).toFixed(1)),
        investors: Math.round(targets.investors * ease),
        agents: Math.round(targets.agents * ease),
        apy: parseFloat((targets.apy * ease).toFixed(1)),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', position: 'relative', overflow: 'hidden' }}>
      <NeuralCanvas />

      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: -200, left: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -200, right: -100, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', left: '50%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 2rem', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(6,7,10,0.6)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>
            <TrendingUp size={16} color="#fff" />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: '#F8FAFC', fontFamily: 'Outfit, sans-serif' }}>
            AGENT <span className="gradient-text-blue">CAPITAL</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {['Products', 'Marketplace', 'Resources', 'Company'].map(item => (
            <span key={item} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F8FAFC')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
              {item}
            </span>
          ))}
        </div>

        <button className="btn-primary" onClick={onLaunchApp} style={{ height: 38 }}>
          Connect Wallet
        </button>
      </nav>

      {/* Hero */}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '80px 3rem 3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', width: '100%' }}>

          {/* Left */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
            {/* Live badge */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.875rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 99, marginBottom: '1.75rem' }}>
              <div className="live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-l)', letterSpacing: '0.03em' }}>Live on 0G Galileo Testnet</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, fontFamily: 'Outfit, sans-serif', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
              <span style={{ color: '#F8FAFC' }}>Autonomous Asset</span><br />
              <span style={{ color: '#F8FAFC' }}>Management for the</span><br />
              <span className="gradient-hero">AI Era</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 480 }}>
              AI agents generating real on-chain yield with verified execution powered by decentralized compute. 45–150% APY. Cryptographic proof on every trade.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', gap: '0.875rem', marginBottom: '3rem' }}>
              <button className="btn-primary" onClick={onLaunchApp}
                style={{ height: 48, padding: '0 1.75rem', fontSize: '0.95rem', borderRadius: 'var(--r-lg)' }}>
                <Zap size={16} /> Launch App <ChevronRight size={15} />
              </button>
              <button className="btn-ghost" style={{ height: 48, padding: '0 1.5rem', fontSize: '0.95rem', borderRadius: 'var(--r-lg)' }}>
                Explore Agents <ExternalLink size={14} />
              </button>
            </motion.div>

            {/* Stat row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {[
                { label: 'Total Profit Generated', val: `$${counters.profit}M`, color: 'var(--green)', change: '+23% this month' },
                { label: 'Active Investors', val: counters.investors.toLocaleString(), color: 'var(--blue-l)', change: '+22% this month' },
                { label: 'Live AI Agents', val: `${counters.agents}+`, color: 'var(--purple-l)', change: '+45 this week' },
                { label: 'Average APY', val: `${counters.apy}%`, color: 'var(--gold-l)', change: '+3.4% this month' },
              ].map(s => (
                <div key={s.label} style={{ padding: '0.875rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--r-lg)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: s.color, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--green)', marginTop: '0.15rem' }}>↑ {s.change}</div>
                </div>
              ))}
            </motion.div>

            {/* Backed by */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Powered by</p>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {PARTNERS.map(p => (
                  <span key={p} style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{p}</span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — animated AI visualization */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: 'relative', height: 560 }}>
            {/* Central hub */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ width: 160, height: 160, borderRadius: '50%', border: '1px dashed rgba(59,130,246,0.3)' }} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--green-l)' }}>60.2%</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AVERAGE APY</div>
              </div>
            </div>

            {/* Orbiting nodes */}
            {[
              { label: 'Yield Harvester+', val: '+87.3%', color: '#3B82F6', angle: 0 },
              { label: 'Volatility Surge', val: '+76.1%', color: '#10B981', angle: 60 },
              { label: 'Arbitrage Bot', val: '+72.8%', color: '#8B5CF6', angle: 120 },
              { label: 'Epsilon Core', val: '+95%', color: '#F59E0B', angle: 180 },
              { label: 'Market Maker', val: '+61.4%', color: '#06B6D4', angle: 240 },
              { label: 'Stable Pro', val: '+48.2%', color: '#10B981', angle: 300 },
            ].map((node, i) => {
              const rad = (node.angle * Math.PI) / 180;
              const r = 220;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              return (
                <motion.div key={i}
                  animate={{ x: [x, x + 6, x], y: [y, y - 4, y] }}
                  transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                  style={{ position: 'absolute', top: '50%', left: '50%',
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    background: 'rgba(13,17,23,0.95)', border: `1px solid ${node.color}40`,
                    borderRadius: 'var(--r-lg)', padding: '0.5rem 0.75rem', whiteSpace: 'nowrap',
                    boxShadow: `0 0 16px ${node.color}20`,
                  }}>
                  <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.1rem' }}>{node.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 800, color: node.color, fontFamily: 'Outfit, sans-serif' }}>{node.val}</div>
                </motion.div>
              );
            })}

            {/* Profit counter floating */}
            <motion.div
              animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', bottom: 30, right: 20, padding: '0.875rem 1.25rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--r-xl)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Today's Profit</div>
              <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--green)', fontFamily: 'Outfit, sans-serif' }}>+$54,720</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              style={{ position: 'absolute', top: 40, right: 30, padding: '0.875rem 1.25rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--r-xl)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Total Profit</div>
              <div style={{ fontSize: '1.375rem', fontWeight: 900, color: 'var(--blue-l)', fontFamily: 'Outfit, sans-serif' }}>$84.2M</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
