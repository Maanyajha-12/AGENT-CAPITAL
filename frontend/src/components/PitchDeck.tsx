import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Presentation, Zap, Shield, Globe, TrendingUp, DollarSign, Layers, Brain, Users, Award, ArrowRight } from 'lucide-react'

const SLIDES = [
    {
        id: 1, title: 'AGENT CAPITAL', subtitle: 'Autonomous AI Agents as Tradeable, Yielding Assets on 0G',
        content: 'The first tokenized intelligence marketplace where AI trading agents generate verified yield, distributed to iNFT holders.',
        icon: Zap, gradient: 'from-blue-500 via-purple-500 to-cyan-500', tag: 'ETHGlobal 2026'
    },
    {
        id: 2, title: 'The Problem', subtitle: '$2.3 Trillion in Unverified AI Decisions',
        content: 'AI agents execute trillions in automated trades annually. Zero are independently verifiable. No cryptographic proof of reasoning. No transparency. No yield attribution.',
        bullets: ['Single-point-of-failure AI systems', 'No cryptographic proof of reasoning', 'Opaque decision processes', 'No verifiable yield attribution'],
        icon: TrendingUp, gradient: 'from-red-500 to-orange-500', tag: 'Problem'
    },
    {
        id: 3, title: 'Our Solution', subtitle: 'Tokenized Intelligence with Verified Yield',
        content: 'Each AI trading agent is minted as an ERC-7857 iNFT. Every trade verified through 0G Compute TEE. Profits distributed to holders. Top performers breed.',
        bullets: ['Agents as tradeable iNFTs with genetic traits', '0G Compute TEE verification with SHA-256 proofs', '70% of profits → iNFT holder dividends', 'Genetic breeding for ecosystem evolution'],
        icon: Shield, gradient: 'from-emerald-500 to-teal-500', tag: 'Solution'
    },
    {
        id: 4, title: 'How It Works', subtitle: '4-Stage Verified Trading Pipeline',
        steps: [
            { label: 'Strategy Agent', desc: 'Analyzes market data, identifies opportunities' },
            { label: 'Research Agent', desc: 'Validates historical accuracy, checks liquidity' },
            { label: 'Risk Agent', desc: 'Calculates max drawdown, approves execution' },
            { label: '0G Verify', desc: 'TEE verification, SHA-256 proof recorded on-chain' },
        ],
        icon: Brain, gradient: 'from-blue-500 to-cyan-500', tag: 'Architecture'
    },
    {
        id: 5, title: '0G Integration', subtitle: 'Full-Stack Decentralized AI Infrastructure',
        bullets: ['0G Compute: TEE-verified inference via Router API (deepseek-chat-v3)', '0G Storage KV: Portfolio state, agent metadata, trade records', '0G Storage Log: Immutable audit trail for all decisions', '0G Chain: 5 smart contracts on Galileo Testnet (Chain ID: 16602)'],
        icon: Layers, gradient: 'from-cyan-500 to-blue-500', tag: '0G Network'
    },
    {
        id: 6, title: 'Market Opportunity', subtitle: 'TAM → SAM → SOM',
        metrics: [
            { label: 'TAM', value: '$2.3T', desc: 'AI-automated decisions globally' },
            { label: 'SAM', value: '$50B', desc: 'Verifiable AI decisions by 2027' },
            { label: 'SOM', value: '$500M', desc: 'DeFi governance & autonomous agents' },
        ],
        icon: Globe, gradient: 'from-purple-500 to-pink-500', tag: 'Market'
    },
    {
        id: 7, title: 'Revenue Model', subtitle: '4 Revenue Streams',
        revenues: [
            { stream: 'Tournament Entry Fees', rate: '0.1 ETH/entry', split: 'Winner 70% · Protocol 30%' },
            { stream: 'iNFT Breeding Royalties', rate: '5% secondary sales', split: 'Parents 2.5% each' },
            { stream: 'Bridge Transaction Fees', rate: '0.5% per message', split: 'Relayers 60% · Protocol 40%' },
            { stream: 'Enterprise API', rate: '$5K/month', split: 'Verifiable AI decision API' },
        ],
        icon: DollarSign, gradient: 'from-emerald-500 to-green-500', tag: 'Revenue'
    },
    {
        id: 8, title: 'Traction', subtitle: 'Live on 0G Galileo Testnet',
        metrics: [
            { label: 'Smart Contracts', value: '5', desc: 'Deployed on Galileo' },
            { label: 'Agent Strategies', value: '4', desc: 'Yield, Arb, Trend, Risk' },
            { label: 'Proofs Recorded', value: '847+', desc: 'SHA-256 verification' },
            { label: 'Frontend', value: 'Live', desc: 'Vercel production' },
        ],
        icon: Award, gradient: 'from-yellow-500 to-orange-500', tag: 'Traction'
    },
    {
        id: 9, title: 'Team & Links', subtitle: 'Built for ETHGlobal 2026',
        links: [
            { label: 'Live Demo', url: 'https://frontend-six-steel-45.vercel.app' },
            { label: 'GitHub', url: 'https://github.com/Maanyajha-12/SWARMOS' },
            { label: '0G Network', url: 'https://0g.ai' },
            { label: 'Block Explorer', url: 'https://chainscan-galileo.0g.ai' },
        ],
        icon: Users, gradient: 'from-blue-500 to-indigo-500', tag: 'Team'
    },
]

export default function PitchDeck() {
    const [current, setCurrent] = useState(0)

    const next = useCallback(() => setCurrent(p => Math.min(p + 1, SLIDES.length - 1)), [])
    const prev = useCallback(() => setCurrent(p => Math.max(p - 1, 0)), [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [next, prev])

    const slide = SLIDES[current]
    const Icon = slide.icon

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.12))', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <Presentation className="w-5 h-5 text-amber-400" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }} />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Pitch Deck</h2>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Use ← → arrow keys to navigate</p>
                    </div>
                </div>
                <span className="text-xs font-mono font-bold tabular-nums" style={{ color: 'var(--text-muted)' }}>{current + 1} / {SLIDES.length}</span>
            </div>

            {/* Progress bar */}
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(100,120,180,0.08)' }}>
                <motion.div animate={{ width: `${((current + 1) / SLIDES.length) * 100}%` }} transition={{ duration: 0.3 }} className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }} />
            </div>

            {/* Slide */}
            <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-8 sm:p-12 min-h-[420px] relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full blur-[100px] opacity-10" style={{ background: `linear-gradient(135deg, var(--neon-blue), var(--neon-purple))` }} />

                    <div className="relative z-10">
                        {/* Tag */}
                        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 inline-block" style={{ background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.15)' }}>{slide.tag}</span>

                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                            <Icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Title */}
                        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{slide.title}</h2>
                        <p className="text-lg font-semibold mb-6" style={{ color: 'var(--text-secondary)' }}>{slide.subtitle}</p>

                        {/* Content */}
                        {slide.content && <p className="text-sm leading-relaxed max-w-2xl mb-6" style={{ color: 'var(--text-secondary)' }}>{slide.content}</p>}

                        {/* Bullets */}
                        {slide.bullets && (
                            <ul className="space-y-2.5 mb-6">
                                {slide.bullets.map((b, i) => (
                                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>{b}
                                    </motion.li>
                                ))}
                            </ul>
                        )}

                        {/* Steps */}
                        {slide.steps && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                                {slide.steps.map((s, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}
                                        className="rounded-xl p-4 border" style={{ background: 'rgba(4,8,16,0.6)', borderColor: 'rgba(100,120,180,0.06)' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-black text-blue-400 tabular-nums">0{i + 1}</span>
                                            {i < 3 && <ArrowRight className="w-3 h-3" style={{ color: 'var(--text-dim)' }} />}
                                        </div>
                                        <p className="text-xs font-bold text-white">{s.label}</p>
                                        <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Metrics */}
                        {slide.metrics && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                {slide.metrics.map((m, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                                        className="rounded-xl p-4 border text-center" style={{ background: 'rgba(4,8,16,0.6)', borderColor: 'rgba(100,120,180,0.06)' }}>
                                        <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{m.label}</p>
                                        <p className="text-2xl font-black text-white mt-1 tabular-nums">{m.value}</p>
                                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{m.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Revenues */}
                        {slide.revenues && (
                            <div className="space-y-2.5 mb-6">
                                {slide.revenues.map((r, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                        className="rounded-xl p-3.5 border flex items-center gap-4" style={{ background: 'rgba(4,8,16,0.6)', borderColor: 'rgba(100,120,180,0.04)' }}>
                                        <div className="flex-1"><p className="text-xs font-bold text-white">{r.stream}</p><p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.split}</p></div>
                                        <span className="text-sm font-bold text-emerald-400">{r.rate}</span>
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Links */}
                        {slide.links && (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {slide.links.map((l, i) => (
                                    <motion.a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -2 }}
                                        className="rounded-xl p-4 border flex items-center gap-3 text-sm font-semibold text-blue-400 transition-all"
                                        style={{ background: 'rgba(4,8,16,0.6)', borderColor: 'rgba(59,130,246,0.1)' }}>
                                        <ArrowRight className="w-4 h-4" />{l.label}
                                    </motion.a>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }} onClick={prev} disabled={current === 0}
                    className="btn-ghost !rounded-xl disabled:opacity-30"><ChevronLeft className="w-4 h-4" />Prev</motion.button>

                <div className="flex gap-1.5">
                    {SLIDES.map((_, i) => (
                        <button key={i} onClick={() => setCurrent(i)}
                            className="w-2 h-2 rounded-full transition-all"
                            style={{ background: i === current ? '#3b82f6' : 'rgba(100,120,180,0.15)', boxShadow: i === current ? '0 0 8px rgba(59,130,246,0.4)' : 'none' }} />
                    ))}
                </div>

                <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.95 }} onClick={next} disabled={current === SLIDES.length - 1}
                    className="btn-ghost !rounded-xl disabled:opacity-30">Next<ChevronRight className="w-4 h-4" /></motion.button>
            </div>
        </div>
    )
}
