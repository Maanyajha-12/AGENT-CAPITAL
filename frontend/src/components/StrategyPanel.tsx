import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Shield, Zap, Clock, Activity, Target, ArrowUpRight, CheckCircle } from 'lucide-react'

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}
const stagger = { animate: { transition: { staggerChildren: 0.08 } } }

const STRATEGIES = [
    { name: 'Yield Optimizer', status: 'active', winRate: 91, avgProfit: 2500, sharpe: 2.4, trades: 342, lastTrade: '2m ago', agents: ['Alpha Fund', 'Epsilon Core'], color: '#3b82f6' },
    { name: 'Arbitrage Hunter', status: 'active', winRate: 78, avgProfit: 1800, sharpe: 1.8, trades: 198, lastTrade: '5m ago', agents: ['Beta Income'], color: '#8b5cf6' },
    { name: 'Trend Follower', status: 'active', winRate: 72, avgProfit: 1200, sharpe: 1.5, trades: 156, lastTrade: '8m ago', agents: ['Gamma Growth', 'Zeta Pulse'], color: '#06b6d4' },
    { name: 'Risk Manager', status: 'active', winRate: 85, avgProfit: 950, sharpe: 2.1, trades: 267, lastTrade: '1m ago', agents: ['Delta Shield'], color: '#10b981' },
]

const RECENT_TRADES = [
    { id: 1, agent: 'Alpha Fund', action: 'Sell 10 ETH → USDC', profit: 2500, confidence: 91, proof: '0x7a3f...e7f6', time: '2m ago', status: 'verified' },
    { id: 2, agent: 'Delta Shield', action: 'Hedge BTC position', profit: 850, confidence: 88, proof: '0x4b2c...a1d3', time: '5m ago', status: 'verified' },
    { id: 3, agent: 'Epsilon Core', action: 'Buy 50 SOL', profit: 3200, confidence: 94, proof: '0x9e1f...b4c8', time: '8m ago', status: 'verified' },
    { id: 4, agent: 'Beta Income', action: 'ARB ETH/MATIC spread', profit: 1100, confidence: 82, proof: '0x2d8a...f5e7', time: '12m ago', status: 'verified' },
    { id: 5, agent: 'Gamma Growth', action: 'Long AVAX momentum', profit: -400, confidence: 71, proof: '0x6c3e...d2a9', time: '15m ago', status: 'verified' },
    { id: 6, agent: 'Alpha Fund', action: 'Rebalance yield pool', profit: 1800, confidence: 89, proof: '0x1f7b...c6e4', time: '22m ago', status: 'verified' },
]

export default function StrategyPanel() {
    const [tick, setTick] = useState(0)
    useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 3000); return () => clearInterval(t) }, [])

    return (
        <div className="space-y-6">
            <motion.div variants={fadeUp} initial="initial" animate="animate" className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(59,130,246,0.12))', border: '1px solid rgba(6,182,212,0.1)' }}>
                    <BarChart3 className="w-5 h-5 text-cyan-400" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.5))' }} />
                </motion.div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Strategy Monitor</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Live trading strategy performance & execution log</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 status-pulse" />
                    <span className="text-[10px] font-semibold text-emerald-400">All Systems Active</span>
                </div>
            </motion.div>

            {/* Strategy Cards */}
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STRATEGIES.map((strat, idx) => (
                    <motion.div key={strat.name} variants={fadeUp} whileHover={{ y: -4 }} className="glass-card p-5 group">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-white text-sm">{strat.name}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
                                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">{strat.status}</span>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg" style={{ background: `${strat.color}15`, border: `1px solid ${strat.color}20` }}>
                                <Activity className="w-4 h-4" style={{ color: strat.color }} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="rounded-lg p-2.5" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.04)' }}>
                                <p className="text-[9px] font-semibold" style={{ color: 'var(--text-dim)' }}>WIN RATE</p>
                                <p className="text-lg font-black tabular-nums" style={{ color: strat.winRate >= 80 ? '#10b981' : strat.winRate >= 70 ? '#f59e0b' : '#ef4444' }}>{strat.winRate}%</p>
                            </div>
                            <div className="rounded-lg p-2.5" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.04)' }}>
                                <p className="text-[9px] font-semibold" style={{ color: 'var(--text-dim)' }}>AVG PROFIT</p>
                                <p className="text-lg font-black text-emerald-400 tabular-nums">${strat.avgProfit.toLocaleString()}</p>
                            </div>
                            <div className="rounded-lg p-2.5" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.04)' }}>
                                <p className="text-[9px] font-semibold" style={{ color: 'var(--text-dim)' }}>SHARPE</p>
                                <p className="text-lg font-black text-blue-400 tabular-nums">{strat.sharpe}</p>
                            </div>
                            <div className="rounded-lg p-2.5" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.04)' }}>
                                <p className="text-[9px] font-semibold" style={{ color: 'var(--text-dim)' }}>TRADES</p>
                                <p className="text-lg font-black text-white tabular-nums">{strat.trades}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(100,120,180,0.06)' }}>
                            <div className="flex items-center gap-1"><Clock className="w-3 h-3" style={{ color: 'var(--text-dim)' }} /><span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Last: {strat.lastTrade}</span></div>
                            <div className="flex -space-x-1.5">
                                {strat.agents.map(a => (
                                    <div key={a} className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: strat.color, border: '1.5px solid rgba(2,4,8,0.8)' }}>{a[0]}</div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Trade Log */}
            <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" style={{ filter: 'drop-shadow(0 0 6px rgba(6,182,212,0.6))' }} />
                        Recent Trades
                    </h3>
                    <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(6,182,212,0.08)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.12)' }}>Live Feed</span>
                </div>

                <div className="space-y-2">
                    {RECENT_TRADES.map((trade, i) => (
                        <motion.div key={trade.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.4 }}
                            className="rounded-xl p-3.5 border flex items-center gap-3 group"
                            style={{ background: 'rgba(4,8,16,0.4)', borderColor: 'rgba(100,120,180,0.04)' }}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${trade.profit >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                {trade.profit >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" /> : <TrendingUp className="w-3.5 h-3.5 text-red-400 rotate-180" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2"><span className="text-xs font-bold text-white">{trade.agent}</span><span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{trade.time}</span></div>
                                <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{trade.action}</p>
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className={`text-sm font-bold tabular-nums ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{trade.profit >= 0 ? '+' : ''}${Math.abs(trade.profit).toLocaleString()}</p>
                                <p className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{trade.confidence}% conf</p>
                            </div>
                            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.1)' }}>
                                <CheckCircle className="w-3 h-3 text-emerald-400" />
                                <span className="text-[9px] font-mono text-emerald-400">{trade.proof}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Strategy Comparison */}
            <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-5 sm:p-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-5">
                    <Target className="w-4 h-4 text-purple-400" style={{ filter: 'drop-shadow(0 0 6px rgba(139,92,246,0.6))' }} />
                    Strategy Comparison
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr style={{ borderBottom: '1px solid rgba(100,120,180,0.08)' }}>
                            {['Strategy', 'Win Rate', 'Avg Profit', 'Sharpe', 'Trades', 'Agents'].map(h => (
                                <th key={h} className="text-left py-3 px-3 text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{h}</th>
                            ))}
                        </tr></thead>
                        <tbody>
                            {STRATEGIES.map(s => (
                                <tr key={s.name} className="transition-colors" style={{ borderBottom: '1px solid rgba(100,120,180,0.04)' }}>
                                    <td className="py-3 px-3"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: s.color }} /><span className="font-semibold text-white text-xs">{s.name}</span></div></td>
                                    <td className="py-3 px-3 font-bold tabular-nums text-xs" style={{ color: s.winRate >= 80 ? '#10b981' : '#f59e0b' }}>{s.winRate}%</td>
                                    <td className="py-3 px-3 font-bold text-emerald-400 tabular-nums text-xs">${s.avgProfit.toLocaleString()}</td>
                                    <td className="py-3 px-3 font-bold text-blue-400 tabular-nums text-xs">{s.sharpe}</td>
                                    <td className="py-3 px-3 font-bold text-white tabular-nums text-xs">{s.trades}</td>
                                    <td className="py-3 px-3 text-xs" style={{ color: 'var(--text-muted)' }}>{s.agents.length}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    )
}
