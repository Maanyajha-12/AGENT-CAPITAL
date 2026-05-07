import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, TrendingUp, DollarSign, Wallet, ArrowUpRight, Sparkles, Zap, Shield, Clock, PieChart, BarChart3 } from 'lucide-react'

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}
const stagger = { animate: { transition: { staggerChildren: 0.08 } } }

const STATS = [
    { label: 'Total Value Locked', value: '$2.47M', change: '+12.3%', icon: Wallet, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Monthly Earnings', value: '$18,420', change: '+8.7%', icon: DollarSign, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Portfolio APY', value: '94.2%', change: '+3.1%', icon: TrendingUp, gradient: 'from-purple-500 to-violet-500' },
    { label: 'Active Holdings', value: '7', change: '+2', icon: PieChart, gradient: 'from-orange-500 to-amber-500' },
]

const HOLDINGS = [
    { name: 'Alpha Fund', gen: 3, accuracy: 92, apy: 1200, tvl: 850000, earning: 8500, strategy: 'Yield Optimizer', color: '#3b82f6' },
    { name: 'Beta Income', gen: 1, accuracy: 84, apy: 850, tvl: 520000, earning: 3683, strategy: 'Arbitrage Hunter', color: '#8b5cf6' },
    { name: 'Gamma Growth', gen: 0, accuracy: 78, apy: 620, tvl: 340000, earning: 1757, strategy: 'Trend Follower', color: '#06b6d4' },
    { name: 'Delta Shield', gen: 2, accuracy: 88, apy: 950, tvl: 280000, earning: 2217, strategy: 'Risk Manager', color: '#10b981' },
    { name: 'Epsilon Core', gen: 4, accuracy: 95, apy: 1450, tvl: 480000, earning: 5800, strategy: 'Yield Optimizer', color: '#f59e0b' },
]

const DIVIDENDS = [
    { month: 'Jan', amount: 14200 }, { month: 'Feb', amount: 15800 },
    { month: 'Mar', amount: 13900 }, { month: 'Apr', amount: 17500 }, { month: 'May', amount: 18420 },
]

export default function PortfolioPanel() {
    const [animated, setAnimated] = useState(false)
    useEffect(() => { setTimeout(() => setAnimated(true), 300) }, [])
    const maxDiv = Math.max(...DIVIDENDS.map(d => d.amount))

    return (
        <div className="space-y-6">
            <motion.div variants={fadeUp} initial="initial" animate="animate" className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))', border: '1px solid rgba(59,130,246,0.1)' }}>
                    <Briefcase className="w-5 h-5 text-blue-400" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.5))' }} />
                </motion.div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">My Portfolio</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Agent iNFT holdings & dividend earnings</p>
                </div>
            </motion.div>

            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STATS.map((s) => {
                    const Icon = s.icon
                    return (
                        <motion.div key={s.label} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-5 group">
                            <div className="flex items-start justify-between mb-3">
                                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                                <div className={`p-2 bg-gradient-to-br ${s.gradient} rounded-lg shadow-lg`}><Icon className="w-3.5 h-3.5 text-white" /></div>
                            </div>
                            <p className="text-2xl font-black text-white tabular-nums">{s.value}</p>
                            <div className="flex items-center gap-1 mt-1.5">
                                <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                                <span className="text-xs font-semibold text-emerald-400">{s.change}</span>
                                <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>this month</span>
                            </div>
                        </motion.div>
                    )
                })}
            </motion.div>

            <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.6))' }} />
                        Agent Holdings
                    </h3>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.12)' }}>{HOLDINGS.length} Active</span>
                </div>
                <div className="space-y-3">
                    {HOLDINGS.map((h, i) => (
                        <motion.div key={h.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.5 }}
                            whileHover={{ x: 4 }} className="rounded-xl p-4 border cursor-pointer group" style={{ background: 'rgba(4,8,16,0.6)', borderColor: 'rgba(100,120,180,0.06)' }}>
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
                                    style={{ background: `linear-gradient(135deg, ${h.color}33, ${h.color}11)`, border: `1px solid ${h.color}22` }}>{h.name[0]}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white text-sm">{h.name}</h4>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: `linear-gradient(135deg, ${h.color}, ${h.color}99)` }}>Gen {h.gen}</span>
                                    </div>
                                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{h.strategy}</p>
                                </div>
                                <div className="text-right hidden md:block"><p className="text-sm font-bold text-white tabular-nums">${(h.tvl / 1000).toFixed(0)}K</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>TVL</p></div>
                                <div className="text-right hidden lg:block"><p className="text-sm font-bold text-emerald-400 tabular-nums">{h.apy}%</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>APY</p></div>
                                <div className="text-right"><p className="text-sm font-bold tabular-nums" style={{ color: h.color }}>{h.accuracy}%</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Acc</p></div>
                                <div className="text-right hidden sm:block"><p className="text-sm font-bold text-emerald-400 tabular-nums">+${h.earning.toLocaleString()}</p><p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>/mo</p></div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="text-[9px] font-medium" style={{ color: 'var(--text-dim)' }}>Performance</span>
                                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(100,120,180,0.08)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: animated ? `${h.accuracy}%` : '0%' }} transition={{ duration: 1.2, delay: i * 0.1 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${h.color}, ${h.color}88)` }} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-5 sm:p-6">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 mb-5">
                        <BarChart3 className="w-4 h-4 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.6))' }} />
                        Monthly Dividends
                    </h3>
                    <div className="flex items-end gap-2 h-40">
                        {DIVIDENDS.map((d, i) => (
                            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                                <span className="text-[10px] font-bold text-emerald-400 tabular-nums">${(d.amount / 1000).toFixed(1)}K</span>
                                <motion.div initial={{ height: 0 }} animate={{ height: `${(d.amount / maxDiv) * 120}px` }} transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                                    className="w-full rounded-t-lg" style={{ background: i === DIVIDENDS.length - 1 ? 'linear-gradient(180deg, #10b981, #059669)' : 'linear-gradient(180deg, rgba(16,185,129,0.4), rgba(16,185,129,0.15))', boxShadow: i === DIVIDENDS.length - 1 ? '0 0 20px rgba(16,185,129,0.2)' : 'none' }} />
                                <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>{d.month}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-5 sm:p-6">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 mb-5">
                        <DollarSign className="w-4 h-4 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.6))' }} />
                        Revenue Distribution
                    </h3>
                    <div className="space-y-4">
                        {[{ label: 'iNFT Holder Dividends', pct: 70, amt: '$12,894', c: '#10b981' }, { label: 'Breeding Fund', pct: 20, amt: '$3,684', c: '#8b5cf6' }, { label: 'Platform Fee', pct: 10, amt: '$1,842', c: '#3b82f6' }].map((item, i) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                                    <div className="flex items-center gap-2"><span className="text-xs font-bold" style={{ color: item.c }}>{item.pct}%</span><span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{item.amt}</span></div>
                                </div>
                                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(100,120,180,0.06)' }}>
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ delay: 0.5 + i * 0.15, duration: 1 }} className="h-full rounded-full" style={{ background: item.c }} />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.06)' }}>
                        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} /><span className="text-xs" style={{ color: 'var(--text-muted)' }}>Next distribution</span></div><span className="text-xs font-bold text-white">3d 14h 22m</span></div>
                    </div>
                </motion.div>
            </div>

            <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-5 flex flex-col sm:flex-row items-center gap-4" style={{ borderColor: 'rgba(16,185,129,0.1)' }}>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.12)' }}><Shield className="w-5 h-5 text-emerald-400" /></div>
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-bold text-white">All earnings verified via 0G Compute TEE</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Every trade decision has a cryptographic SHA-256 proof hash recorded on-chain</p>
                </div>
                <div className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-emerald-400" /><span className="text-[10px] font-bold text-emerald-400">847 proofs recorded</span></div>
            </motion.div>
        </div>
    )
}
