import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, Search, SlidersHorizontal, TrendingUp, Dna, Shield, Zap, ArrowUpRight, Star, Filter } from 'lucide-react'

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}
const stagger = { animate: { transition: { staggerChildren: 0.06 } } }

const AGENTS_FOR_SALE = [
    { id: 1001, name: 'Alpha Fund', gen: 3, accuracy: 92, apy: 1200, price: 5.2, priceUsd: 16200, strategy: 'Yield Optimizer', trades: 847, winRate: 87, traits: { risk: 7, speed: 85, accuracy: 92 }, verified: true, color: '#3b82f6', hot: true },
    { id: 1002, name: 'Beta Income', gen: 1, accuracy: 84, apy: 850, price: 2.1, priceUsd: 6510, strategy: 'Arbitrage Hunter', trades: 523, winRate: 72, traits: { risk: 8, speed: 90, accuracy: 84 }, verified: true, color: '#8b5cf6', hot: false },
    { id: 1003, name: 'Gamma Growth', gen: 0, accuracy: 78, apy: 620, price: 0.8, priceUsd: 2480, strategy: 'Trend Follower', trades: 312, winRate: 68, traits: { risk: 6, speed: 75, accuracy: 78 }, verified: true, color: '#06b6d4', hot: false },
    { id: 1004, name: 'Delta Shield', gen: 2, accuracy: 88, apy: 950, price: 3.4, priceUsd: 10540, strategy: 'Risk Manager', trades: 689, winRate: 82, traits: { risk: 4, speed: 70, accuracy: 88 }, verified: true, color: '#10b981', hot: true },
    { id: 1005, name: 'Epsilon Core', gen: 4, accuracy: 95, apy: 1450, price: 8.7, priceUsd: 26970, strategy: 'Yield Optimizer', trades: 1203, winRate: 91, traits: { risk: 5, speed: 88, accuracy: 95 }, verified: true, color: '#f59e0b', hot: true },
    { id: 1006, name: 'Zeta Pulse', gen: 1, accuracy: 81, apy: 720, price: 1.5, priceUsd: 4650, strategy: 'Trend Follower', trades: 445, winRate: 70, traits: { risk: 9, speed: 92, accuracy: 81 }, verified: false, color: '#ec4899', hot: false },
]

type SortBy = 'price' | 'apy' | 'accuracy' | 'gen'

export default function MarketplacePanel() {
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortBy>('apy')
    const [selectedAgent, setSelectedAgent] = useState<number | null>(null)

    const filtered = AGENTS_FOR_SALE
        .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.strategy.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            switch (sortBy) {
                case 'price': return b.price - a.price
                case 'apy': return b.apy - a.apy
                case 'accuracy': return b.accuracy - a.accuracy
                case 'gen': return b.gen - a.gen
                default: return 0
            }
        })

    return (
        <div className="space-y-6">
            <motion.div variants={fadeUp} initial="initial" animate="animate" className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(236,72,153,0.12))', border: '1px solid rgba(139,92,246,0.1)' }}>
                    <Store className="w-5 h-5 text-purple-400" style={{ filter: 'drop-shadow(0 0 8px rgba(139,92,246,0.5))' }} />
                </motion.div>
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Agent Marketplace</h2>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Discover, trade & collect high-performing agent iNFTs</p>
                </div>
            </motion.div>

            {/* Market Stats */}
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[{ label: 'Floor Price', value: '0.8 ETH', sub: '$2,480' }, { label: 'Volume (24h)', value: '12.4 ETH', sub: '$38,440' }, { label: 'Listed', value: '6', sub: 'agents' }, { label: 'Avg APY', value: '965%', sub: 'across all' }].map(s => (
                    <motion.div key={s.label} variants={fadeUp} className="rounded-xl p-3.5 border" style={{ background: 'rgba(4,8,16,0.6)', borderColor: 'rgba(100,120,180,0.06)' }}>
                        <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--text-dim)' }}>{s.label}</p>
                        <p className="text-lg font-black text-white mt-0.5 tabular-nums">{s.value}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
                    </motion.div>
                ))}
            </motion.div>

            {/* Search & Sort */}
            <motion.div variants={fadeUp} initial="initial" animate="animate" className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                    <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search agents by name or strategy..."
                        className="input-field !pl-10 !rounded-xl" />
                </div>
                <div className="flex gap-1.5 p-1 rounded-xl" style={{ background: 'rgba(4,8,16,0.8)', border: '1px solid rgba(100,120,180,0.08)' }}>
                    {(['apy', 'accuracy', 'price', 'gen'] as SortBy[]).map(s => (
                        <button key={s} onClick={() => setSortBy(s)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${sortBy === s ? 'text-blue-300' : ''}`}
                            style={sortBy === s ? { background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)' } : { color: 'var(--text-muted)' }}>
                            {s === 'apy' ? 'APY' : s === 'gen' ? 'Gen' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Agent Grid */}
            <motion.div variants={stagger} initial="initial" animate="animate" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((agent, idx) => (
                    <motion.div key={agent.id} variants={fadeUp}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                        className="glass-card p-5 cursor-pointer group relative overflow-hidden"
                    >
                        {agent.hot && (
                            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
                                style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                                <Star className="w-2.5 h-2.5" /> HOT
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-lg"
                                style={{ background: `linear-gradient(135deg, ${agent.color}44, ${agent.color}11)`, border: `1px solid ${agent.color}33`, boxShadow: `0 0 20px ${agent.color}15` }}>
                                {agent.name[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm group-hover:text-blue-300 transition-colors">{agent.name}</h3>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white" style={{ background: `${agent.color}` }}>Gen {agent.gen}</span>
                                    {agent.verified && <Shield className="w-3 h-3 text-emerald-400" />}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.04)' }}>
                                <p className="text-[9px] font-semibold" style={{ color: 'var(--text-dim)' }}>APY</p>
                                <p className="text-sm font-bold text-emerald-400 tabular-nums">{agent.apy}%</p>
                            </div>
                            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.04)' }}>
                                <p className="text-[9px] font-semibold" style={{ color: 'var(--text-dim)' }}>ACC</p>
                                <p className="text-sm font-bold tabular-nums" style={{ color: agent.color }}>{agent.accuracy}%</p>
                            </div>
                            <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(4,8,16,0.6)', border: '1px solid rgba(100,120,180,0.04)' }}>
                                <p className="text-[9px] font-semibold" style={{ color: 'var(--text-dim)' }}>WIN</p>
                                <p className="text-sm font-bold text-blue-400 tabular-nums">{agent.winRate}%</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(100,120,180,0.06)' }}>
                            <div>
                                <p className="text-lg font-black text-white tabular-nums">{agent.price} ETH</p>
                                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>${agent.priceUsd.toLocaleString()}</p>
                            </div>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                                style={{ background: `linear-gradient(135deg, ${agent.color}, ${agent.color}cc)`, boxShadow: `0 4px 15px ${agent.color}30` }}>
                                Buy iNFT
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {selectedAgent === agent.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 pt-3 space-y-2" style={{ borderTop: '1px solid rgba(100,120,180,0.06)' }}>
                                    <div className="flex items-center justify-between text-xs"><span style={{ color: 'var(--text-muted)' }}>Strategy</span><span className="font-semibold text-white">{agent.strategy}</span></div>
                                    <div className="flex items-center justify-between text-xs"><span style={{ color: 'var(--text-muted)' }}>Total Trades</span><span className="font-semibold text-white tabular-nums">{agent.trades}</span></div>
                                    <div className="flex items-center justify-between text-xs"><span style={{ color: 'var(--text-muted)' }}>Risk Tolerance</span><span className="font-semibold text-white tabular-nums">{agent.traits.risk}/10</span></div>
                                    <div className="flex items-center justify-between text-xs"><span style={{ color: 'var(--text-muted)' }}>Exec Speed</span><span className="font-semibold text-white tabular-nums">{agent.traits.speed}%</span></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div variants={fadeUp} initial="initial" animate="animate" className="glass-card p-5 flex flex-col sm:flex-row items-center gap-4" style={{ borderColor: 'rgba(139,92,246,0.1)' }}>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.12)' }}><Dna className="w-5 h-5 text-purple-400" /></div>
                <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-bold text-white">Agent iNFTs are ERC-7857 tokens with genetic traits</p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Buy, hold for yield, or breed top performers to create even better agents</p>
                </div>
                <div className="flex items-center gap-2"><ArrowUpRight className="w-3.5 h-3.5 text-purple-400" /><span className="text-[10px] font-bold text-purple-400">View Gallery →</span></div>
            </motion.div>
        </div>
    )
}
