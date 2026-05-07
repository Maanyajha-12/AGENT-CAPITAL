import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Shield, Globe, TrendingUp, ArrowRight, Cpu, Activity } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as any } },
}
const stagger = { animate: { transition: { staggerChildren: 0.1 } } }

const TICKERS = [
  'ALPHA/ETH +12.3%', 'BETA/USDC +8.7%', 'GAMMA/BTC -2.1%',
  'DELTA/ETH +5.4%', 'EPSILON/SOL +19.2%', '847 PROOFS VERIFIED',
  '3 CHAINS ACTIVE', 'AVG CONFIDENCE 91%', 'TVL $2.47M',
  'ALPHA/ETH +12.3%', 'BETA/USDC +8.7%', 'GAMMA/BTC -2.1%',
  'DELTA/ETH +5.4%', 'EPSILON/SOL +19.2%', '847 PROOFS VERIFIED',
]

const STATS = [
  { label: 'Agents Deployed', value: '12', icon: Cpu, color: '#4f8fff' },
  { label: 'Decisions Verified', value: '847', icon: Shield, color: '#00e5a0' },
  { label: 'Chains Connected', value: '3', icon: Globe, color: '#8b5cf6' },
  { label: 'Avg Confidence', value: '91%', icon: Activity, color: '#00d4ff' },
]

const FEATURES = [
  { icon: Shield, title: '0G TEE Verified', desc: 'Every decision cryptographically proven via Trusted Execution Environment. SHA-256 proofs recorded on-chain.', color: '#00e5a0', glow: 'rgba(0,229,160,0.12)' },
  { icon: TrendingUp, title: 'Yield-Bearing iNFTs', desc: 'Agents are ERC-7857 tokens. Hold to earn 70% of all trade profits distributed automatically on-chain.', color: '#4f8fff', glow: 'rgba(79,143,255,0.12)' },
  { icon: Zap, title: 'Genetic Evolution', desc: 'Top-performing agents breed to create superior offspring. Darwin meets DeFi in a fully autonomous ecosystem.', color: '#8b5cf6', glow: 'rgba(139,92,246,0.12)' },
  { icon: Globe, title: 'Cross-Chain Native', desc: 'Unified intelligence marketplace across Ethereum, Polygon, and 0G Chain with atomic bridge messaging.', color: '#00d4ff', glow: 'rgba(0,212,255,0.12)' },
]

// Animated topology/network SVG hero
function NetworkHero() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 80)
    return () => clearInterval(t)
  }, [])

  const cx = 400, cy = 280, R = 160
  const nodes = [
    { id: 'core', x: cx, y: cy, r: 22, color: '#4f8fff', label: 'CORE' },
    { id: 'planner', x: cx + R * Math.cos(0), y: cy + R * Math.sin(0), r: 14, color: '#8b5cf6', label: 'PLANNER' },
    { id: 'research', x: cx + R * Math.cos(Math.PI * 0.5), y: cy + R * Math.sin(Math.PI * 0.5), r: 14, color: '#00d4ff', label: 'RESEARCH' },
    { id: 'critic', x: cx + R * Math.cos(Math.PI), y: cy + R * Math.sin(Math.PI), r: 14, color: '#00e5a0', label: 'CRITIC' },
    { id: 'executor', x: cx + R * Math.cos(Math.PI * 1.5), y: cy + R * Math.sin(Math.PI * 1.5), r: 14, color: '#f59e0b', label: 'EXECUTOR' },
    { id: 'eth', x: cx + 270, y: cy - 80, r: 10, color: '#627EEA', label: 'ETH' },
    { id: 'poly', x: cx + 260, y: cy + 60, r: 10, color: '#8247E5', label: 'MATIC' },
    { id: 'og', x: cx - 270, y: cy - 60, r: 10, color: '#00e5a0', label: '0G' },
  ]

  const edges = [
    ['core', 'planner'], ['core', 'research'], ['core', 'critic'], ['core', 'executor'],
    ['planner', 'research'], ['research', 'critic'], ['critic', 'executor'],
    ['executor', 'eth'], ['executor', 'poly'], ['core', 'og'],
  ]

  const getNode = (id: string) => nodes.find(n => n.id === id)!

  const packetOffset = (tick * 2) % 100

  return (
    <svg ref={svgRef} viewBox="0 0 800 560" className="w-full h-full" style={{ overflow: 'visible' }}>
      <defs>
        {nodes.map(n => (
          <radialGradient key={n.id} id={`ng-${n.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={n.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={n.color} stopOpacity="0.1" />
          </radialGradient>
        ))}
        <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4f8fff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4f8fff" stopOpacity="0" />
        </radialGradient>
        <filter id="glow-filter">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Radial background glow */}
      <circle cx={cx} cy={cy} r="220" fill="url(#core-glow)" />

      {/* Topology grid rings */}
      {[80, 130, 180, 240].map(r => (
        <circle key={r} cx={cx} cy={cy} r={r}
          fill="none" stroke="rgba(79,143,255,0.05)" strokeWidth="1"
          strokeDasharray="4 8" />
      ))}

      {/* Edges */}
      {edges.map(([a, b], i) => {
        const n1 = getNode(a), n2 = getNode(b)
        if (!n1 || !n2) return null
        const len = Math.sqrt((n2.x - n1.x) ** 2 + (n2.y - n1.y) ** 2)
        return (
          <g key={`${a}-${b}`}>
            <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke="rgba(79,143,255,0.15)" strokeWidth="1" />
            {/* animated packet */}
            <circle r="3" fill={n1.color} filter="url(#glow-filter)" opacity="0.9">
              <animateMotion dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite">
                <mpath href={`#path-${a}-${b}`} />
              </animateMotion>
            </circle>
            <path id={`path-${a}-${b}`} d={`M${n1.x},${n1.y} L${n2.x},${n2.y}`} fill="none" />
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const pulseR = n.r + Math.sin((tick * 0.06) + i * 0.8) * 3
        return (
          <g key={n.id} filter="url(#glow-filter)">
            {/* outer glow ring */}
            <circle cx={n.x} cy={n.y} r={pulseR * 2.8} fill={n.color} opacity="0.06" />
            <circle cx={n.x} cy={n.y} r={pulseR * 1.8} fill={n.color} opacity="0.1" />
            {/* node body */}
            <circle cx={n.x} cy={n.y} r={pulseR} fill={`url(#ng-${n.id})`} stroke={n.color} strokeWidth="1.5" strokeOpacity="0.7" />
            {/* label */}
            <text x={n.x} y={n.y + pulseR + 14} textAnchor="middle"
              fill={n.color} fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono',monospace"
              opacity="0.85">{n.label}</text>
          </g>
        )
      })}

      {/* Central holographic overlay */}
      <circle cx={cx} cy={cy} r="28" fill="none" stroke="#4f8fff" strokeWidth="1" strokeDasharray="3 6"
        opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="12s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

export default function LandingPage({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 100) }, [])

  return (
    <div className="relative space-y-0 -mt-2">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden pb-16">

        {/* Radial glow center */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(79,143,255,0.07) 0%, rgba(139,92,246,0.04) 40%, transparent 70%)' }} />
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)', animation: 'float-slow 14s ease-in-out infinite' }} />
          <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', animation: 'float-slow 18s ease-in-out infinite reverse' }} />
        </div>

        {/* Content grid: text left, network right */}
        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div variants={stagger} initial="initial" animate={mounted ? 'animate' : 'initial'}>
            <motion.div variants={fadeUp} className="mb-6">
              <span className="tag tag-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 status-pulse inline-block" />
                BUILT ON 0G NETWORK · GALILEO TESTNET
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp}
              className="text-4xl sm:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
              Autonomous AI Agents as{' '}
              <span className="gradient-text text-glow-blue">
                Tradeable, Yielding Assets
              </span>
            </motion.h1>

            <motion.p variants={fadeUp}
              className="text-base sm:text-lg leading-relaxed mb-8"
              style={{ color: 'var(--text-secondary)', maxWidth: '520px' }}>
              AGENT CAPITAL is the first tokenized intelligence marketplace — AI trading agents
              generate verified yield through 0G Compute TEE, distributed to iNFT holders.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <motion.button
                whileHover={{ y: -3, boxShadow: '0 16px 50px rgba(79,143,255,0.45)' }}
                whileTap={{ y: 0 }}
                onClick={() => onNavigate?.('deliberate')}
                className="btn-primary px-7 py-3.5 text-sm"
                style={{ borderRadius: '14px' }}>
                <Zap className="w-4 h-4" /> Try Live Demo
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => onNavigate?.('pitch')}
                className="btn-ghost px-6 py-3.5 text-sm"
                style={{ borderRadius: '14px' }}>
                View Pitch Deck
              </motion.button>
            </motion.div>

            {/* Inline stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STATS.map(s => {
                const Icon = s.icon
                return (
                  <motion.div key={s.label} whileHover={{ y: -3 }}
                    className="glass-card p-3.5 holo-panel text-center"
                    style={{ boxShadow: `0 0 20px ${s.color}10` }}>
                    <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: s.color }} />
                    <p className="text-lg font-black text-white tabular-nums">{s.value}</p>
                    <p className="text-[9px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Right: animated network */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
            style={{ height: '520px' }}>
            {/* Holographic frame */}
            <div className="absolute inset-0 rounded-2xl holo-border glass-card-elevated holo-panel" style={{ overflow: 'hidden' }}>
              <div className="absolute top-3 left-4 flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>NEURAL TOPOLOGY</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
              </div>
              <div className="absolute top-3 right-4">
                <span className="text-[9px] font-mono" style={{ color: 'var(--text-dim)' }}>0G:16602</span>
              </div>
              <div className="w-full h-full pt-6">
                <NetworkHero />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TELEMETRY TICKER ────────────────────────────────────── */}
      <div className="relative overflow-hidden py-3 border-y"
        style={{ borderColor: 'rgba(79,143,255,0.06)', background: 'rgba(4,6,8,0.7)', backdropFilter: 'blur(16px)' }}>
        <div className="flex ticker-track whitespace-nowrap gap-8">
          {TICKERS.map((t, i) => (
            <span key={i} className="text-[11px] font-mono font-semibold flex items-center gap-2"
              style={{ color: t.includes('+') ? '#00e5a0' : t.includes('-') ? '#f87171' : 'var(--text-muted)' }}>
              <span className="w-1 h-1 rounded-full inline-block"
                style={{ background: t.includes('+') ? '#00e5a0' : t.includes('-') ? '#f87171' : '#4f8fff' }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section className="py-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            The Full Stack of{' '}
            <span className="gradient-text">Verifiable Intelligence</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Four pillars that make AGENT CAPITAL the definitive platform for autonomous AI finance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-card p-6 holo-panel group relative overflow-hidden"
                style={{ boxShadow: `0 0 30px ${f.glow}` }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-8 translate-x-8"
                  style={{ background: `radial-gradient(circle, ${f.color}, transparent)` }} />
                <motion.div whileHover={{ scale: 1.15, rotate: 8 }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}25`, boxShadow: `0 0 20px ${f.color}20` }}>
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </motion.div>
                <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── PIPELINE VISUALIZATION ──────────────────────────────── */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="glass-card-elevated holo-panel p-8 sm:p-12 relative overflow-hidden"
          style={{ borderRadius: '24px' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(79,143,255,0.05) 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="tag tag-blue">4-STAGE PIPELINE</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>LIVE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Every Decision is Verified</h2>
            <p className="mb-10 text-sm" style={{ color: 'var(--text-secondary)' }}>
              From prompt to cryptographic proof — every trade is transparent, auditable, and immutable.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-0">
              {[
                { n: '01', label: 'Strategy', desc: 'Identifies opportunities across markets', color: '#4f8fff' },
                { n: '02', label: 'Research', desc: 'Validates historical accuracy & liquidity', color: '#8b5cf6' },
                { n: '03', label: 'Risk', desc: 'Calculates drawdown, approves execution', color: '#00d4ff' },
                { n: '04', label: '0G Verify', desc: 'TEE proof · SHA-256 hash on-chain', color: '#00e5a0' },
              ].map((step, i) => (
                <div key={step.n} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 relative">
                  {i < 3 && (
                    <div className="hidden sm:block absolute top-6 left-1/2 w-full h-px"
                      style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }} />
                  )}
                  <motion.div
                    initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                    transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                    viewport={{ once: true }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 sm:mx-auto sm:mb-4 z-10"
                    style={{ background: `${step.color}15`, border: `1px solid ${step.color}30`, boxShadow: `0 0 24px ${step.color}20` }}>
                    <span className="text-xs font-black font-mono" style={{ color: step.color }}>{step.n}</span>
                  </motion.div>
                  <div className="sm:text-center sm:px-4">
                    <p className="text-sm font-bold text-white">{step.label}</p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} viewport={{ once: true }}
          className="text-center glass-card p-12 relative overflow-hidden holo-border"
          style={{ borderRadius: '24px' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(79,143,255,0.08) 0%, transparent 60%)' }} />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 relative z-10">
            Ready to Deploy Your First Agent?
          </h2>
          <p className="mb-8 text-base relative z-10 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Submit a prompt. Watch 4 AI agents analyze it in real time. Get a cryptographic proof on 0G.
          </p>
          <motion.button whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(79,143,255,0.5)' }}
            whileTap={{ y: 0 }}
            onClick={() => onNavigate?.('deliberate')}
            className="btn-primary px-10 py-4 text-sm relative z-10">
            <Zap className="w-4 h-4" /> Start Deliberation
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  )
}
