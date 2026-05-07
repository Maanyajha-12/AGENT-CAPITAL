import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, Zap, Dna, Swords, Wifi, WifiOff, Globe, Briefcase, Store, TrendingUp, Presentation } from 'lucide-react'
import LandingPage from './components/LandingPage'
import DeliberationPanel from './components/DeliberationPanel'
import AgentMonitor from './components/AgentMonitor'
import SystemStats from './components/SystemStats'
import Gallery from './components/Gallery'
import ArenaPanel from './components/ArenaPanel'
import CrossChainDashboard from './components/CrossChainDashboard'
import PortfolioPanel from './components/PortfolioPanel'
import MarketplacePanel from './components/MarketplacePanel'
import StrategyPanel from './components/StrategyPanel'
import PitchDeck from './components/PitchDeck'
import WebSocketManager from './services/websocket'

type TabId = 'overview' | 'portfolio' | 'marketplace' | 'strategy' | 'deliberate' | 'gallery' | 'arena' | 'crosschain' | 'analytics' | 'pitch'

const pageVariants = {
    initial: { opacity: 0, y: 16, scale: 0.99 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
    exit: { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.2 } },
}

function App() {
    const [activeTab, setActiveTab] = useState<TabId>('overview')
    const [wsConnected, setWsConnected] = useState(false)
    const [systemHealth, setSystemHealth] = useState('checking')

    useEffect(() => {
        const ws = WebSocketManager.getInstance()
        ws.connect()
        ws.onConnected(() => setWsConnected(true))
        ws.onDisconnected(() => setWsConnected(false))
        return () => { ws.disconnect() }
    }, [])

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || ''
                const response = await fetch(`${apiUrl}/api/health`)
                setSystemHealth(response.ok ? 'healthy' : 'unhealthy')
            } catch {
                setSystemHealth('disconnected')
            }
        }
        checkHealth()
        const interval = setInterval(checkHealth, 10000)
        return () => clearInterval(interval)
    }, [])

    const handleNavigate = (tab: string) => {
        setActiveTab(tab as TabId)
    }

    const tabs: { id: TabId; label: string; icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: TrendingUp },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
        { id: 'marketplace', label: 'Marketplace', icon: Store },
        { id: 'strategy', label: 'Strategy', icon: BarChart3 },
        { id: 'deliberate', label: 'Deliberate', icon: Zap },
        { id: 'gallery', label: 'Gallery', icon: Dna },
        { id: 'arena', label: 'Arena', icon: Swords },
        { id: 'crosschain', label: 'Cross-Chain', icon: Globe },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'pitch', label: 'Pitch', icon: Presentation },
    ]

    const renderTab = () => {
        switch (activeTab) {
            case 'overview': return <LandingPage onNavigate={handleNavigate} />
            case 'portfolio': return <PortfolioPanel />
            case 'marketplace': return <MarketplacePanel />
            case 'strategy': return <StrategyPanel />
            case 'deliberate': return <DeliberationPanel />
            case 'gallery': return <Gallery />
            case 'arena': return <ArenaPanel />
            case 'crosschain': return <CrossChainDashboard />
            case 'analytics': return <SystemStats />
            case 'pitch': return <PitchDeck />
        }
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-void)' }}>
            {/* ── Ambient background ── */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/[0.02] rounded-full blur-[80px] animate-float" />
            </div>

            {/* ── Header ── */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-white/[0.04] sticky top-0 z-50"
                style={{ background: 'rgba(2, 4, 8, 0.8)', backdropFilter: 'blur(24px) saturate(1.5)' }}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5 group cursor-default" onClick={() => setActiveTab('overview')}>
                            <div className="relative">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2.5 rounded-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)',
                                        boxShadow: '0 0 24px rgba(59, 130, 246, 0.3), 0 0 48px rgba(139, 92, 246, 0.15)'
                                    }}
                                >
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </motion.div>
                                <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-lg animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black tracking-wider gradient-text" style={{ fontSize: '1.25rem' }}>AGENT CAPITAL</h1>
                                <p className="text-[0.55rem] font-semibold tracking-[0.25em] uppercase" style={{ color: 'var(--text-dim)' }}>
                                    Tokenized Intelligence Marketplace
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${wsConnected
                                    ? 'text-emerald-400'
                                    : 'text-red-400'
                                    }`}
                                style={{
                                    background: wsConnected ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.06)',
                                    border: `1px solid ${wsConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'}`
                                }}
                            >
                                <div className="relative">
                                    {wsConnected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                                    {wsConnected && <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />}
                                </div>
                                <span className="hide-mobile">{wsConnected ? 'Live' : 'Demo'}</span>
                            </motion.div>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                                style={{
                                    background: systemHealth === 'healthy' ? 'rgba(16, 185, 129, 0.06)' : systemHealth === 'checking' ? 'rgba(59, 130, 246, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                                    border: `1px solid ${systemHealth === 'healthy' ? 'rgba(16, 185, 129, 0.12)' : systemHealth === 'checking' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)'}`,
                                    color: systemHealth === 'healthy' ? '#10b981' : systemHealth === 'checking' ? '#3b82f6' : '#f59e0b'
                                }}
                            >
                                <div className={`w-2 h-2 rounded-full ${systemHealth === 'healthy' ? 'bg-emerald-400 status-pulse' :
                                    systemHealth === 'checking' ? 'bg-blue-400 animate-pulse' : 'bg-orange-400'
                                    }`} />
                                <span className="capitalize hide-mobile">{systemHealth === 'disconnected' ? 'demo' : systemHealth}</span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* ── Navigation Tabs ── */}
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="border-b sticky top-[57px] z-40"
                style={{
                    borderColor: 'rgba(100, 120, 180, 0.06)',
                    background: 'rgba(2, 4, 8, 0.7)',
                    backdropFilter: 'blur(20px) saturate(1.4)'
                }}
            >
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative flex overflow-x-auto scrollbar-none">
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                id={`tab-${id}`}
                                onClick={() => setActiveTab(id)}
                                className={`relative px-3.5 sm:px-4 py-3 font-medium text-[13px] flex items-center gap-1.5 transition-all duration-200 whitespace-nowrap ${activeTab === id
                                    ? 'text-blue-400'
                                    : 'hover:bg-white/[0.02]'
                                    }`}
                                style={{ color: activeTab === id ? '#60a5fa' : 'var(--text-muted)' }}
                            >
                                <Icon className={`w-3.5 h-3.5 transition-all duration-200 ${activeTab === id ? 'drop-shadow-[0_0_6px_rgba(96,165,250,0.6)]' : ''}`}
                                    style={{ color: activeTab === id ? '#60a5fa' : undefined }}
                                />
                                <span className="hidden sm:inline">{label}</span>
                                {activeTab === id && (
                                    <motion.div
                                        layoutId="tab-indicator"
                                        className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                                        style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── Main Content ── */}
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {renderTab()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* ── Footer ── */}
            <footer className="mt-12 sm:mt-20" style={{ borderTop: '1px solid rgba(100, 120, 180, 0.06)' }}>
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-dim)' }}>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }} />
                            <p>AGENT CAPITAL — Tokenized Intelligence Marketplace</p>
                        </div>
                        <p>Powered by <span style={{ color: 'var(--text-muted)' }} className="font-medium">0G Network</span> · <span style={{ color: 'var(--text-muted)' }} className="font-medium">Anthropic Claude</span></p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default App
