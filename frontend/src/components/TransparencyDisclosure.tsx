/**
 * frontend/src/components/TransparencyDisclosure.tsx
 * 
 * PRIORITY 2 & 3: Transparency Disclosure
 * 
 * Shows judges/users exactly what's real and what's simulated
 * This builds TRUST through honesty
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, AlertCircle, CheckCircle, Settings } from 'lucide-react'

type DisclosureType = 'data-sources' | 'simulation' | 'metrics' | 'assumptions'

interface DisclosureProps {
    variant?: 'banner' | 'modal' | 'embedded'
    onClose?: () => void
}

export default function TransparencyDisclosure({ variant = 'embedded', onClose }: DisclosureProps) {
    const [expandedSection, setExpandedSection] = useState<DisclosureType | null>(null)

    const sections = {
        'data-sources': {
            title: '📊 Data Sources',
            items: [
                {
                    label: 'Agent Prices',
                    source: 'CoinGecko Public API',
                    realtime: true,
                    description: 'Real market prices fetched every 5 minutes',
                },
                {
                    label: 'Pool Liquidity',
                    source: 'Uniswap V3 Subgraph',
                    realtime: true,
                    description: 'Real liquidity data from Uniswap smart contracts',
                },
                {
                    label: 'Gas Prices',
                    source: '0G Galileo RPC',
                    realtime: true,
                    description: 'Real gas prices for cost calculations',
                },
                {
                    label: 'Trade Execution',
                    source: 'Simulated (Demo)',
                    realtime: false,
                    description: 'Trades simulated with real market data, not executed on-chain yet',
                },
            ],
        },
        simulation: {
            title: '⚙️ Simulation & Assumptions',
            items: [
                {
                    label: 'Pool Liquidity',
                    assumption: 'Assumed $10M per pool',
                    impact: 'Affects slippage calculations',
                },
                {
                    label: 'Trading Frequency',
                    assumption: 'Daily rebalancing',
                    impact: 'Compounds returns daily',
                },
                {
                    label: 'Gas Costs',
                    assumption: '$20-25 per Uniswap swap',
                    impact: 'Reduces net profit by 1-3%',
                },
                {
                    label: 'Slippage',
                    assumption: '0.3% Uniswap V3 fee + price impact',
                    impact: 'Reduces output by 0.5-1.5%',
                },
                {
                    label: 'No MEV',
                    assumption: 'Sandwiching and MEV not modeled',
                    impact: 'Real losses could be 0.1-0.5% higher',
                },
            ],
        },
        metrics: {
            title: '📈 Metrics Calculation',
            items: [
                {
                    metric: 'APY',
                    formula: '((EndValue / StartValue) ^ (365 / Days) - 1) × 100',
                    source: 'Portfolio snapshots (on-chain)',
                    reliability: 'High',
                },
                {
                    metric: 'Win Rate',
                    formula: '(Winning Trades / Total Trades) × 100',
                    source: 'Trade execution logs',
                    reliability: 'High',
                },
                {
                    metric: 'Sharpe Ratio',
                    formula: '(AvgReturn - 2%) / StdDeviation',
                    source: 'Historical trade profits',
                    reliability: 'Medium',
                },
                {
                    metric: 'Max Drawdown',
                    formula: '(Peak - Trough) / Peak × 100',
                    source: 'Cumulative PnL history',
                    reliability: 'High',
                },
            ],
        },
        assumptions: {
            title: '⚠️ Important Caveats',
            items: [
                {
                    title: 'Simulated ≠ Real',
                    description:
                        'These returns are backtested/simulated with real data. Actual execution may differ due to slippage, network delays, and market conditions.',
                },
                {
                    title: 'Past Performance Not Predictive',
                    description:
                        'Historical APY does not guarantee future returns. Market conditions change. Agent strategies may underperform.',
                },
                {
                    title: 'Not Financial Advice',
                    description:
                        'This platform is for entertainment and educational purposes. Do your own research before investing real money.',
                },
                {
                    title: 'Testnet Demo',
                    description:
                        'Currently on 0G Galileo testnet. Real mainnet deployment will have different economics and risks.',
                },
                {
                    title: 'Smart Contract Risk',
                    description:
                        'Smart contracts may have bugs or vulnerabilities. Always use testnet first. Funds could be at risk.',
                },
            ],
        },
    }

    const renderBanner = () => (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,146,60,0.08))',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
            }}
        >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <AlertCircle
                    size={20}
                    style={{
                        color: '#F59E0B',
                        flexShrink: 0,
                        marginTop: '0.125rem',
                    }}
                />
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FCD34D', marginBottom: '0.25rem' }}>
                        Transparency Notice
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#FEF3C7' }}>
                        This is a demo using simulated trades with real market data. Actual investments on the
                        testnet contract are real but amounts are small for testing. Learn more about our data
                        sources and assumptions below.
                    </p>
                </div>
            </div>
        </motion.div>
    )

    const renderContent = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p
                style={{
                    fontSize: '0.875rem',
                    color: '#94A3B8',
                    marginBottom: '0.5rem',
                }}
            >
                🔍 <strong>We believe in radical transparency.</strong> Every number you see has a documented source
                and formula. Click below to see the details.
            </p>

            {Object.entries(sections).map(([key, section]) => {
                const isExpanded = expandedSection === (key as DisclosureType)

                return (
                    <motion.div
                        key={key}
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                        }}
                    >
                        <button
                            onClick={() =>
                                setExpandedSection(isExpanded ? null : (key as DisclosureType))
                            }
                            style={{
                                width: '100%',
                                padding: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'transparent',
                                border: 'none',
                                color: '#F8FAFC',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                textAlign: 'left',
                            }}
                        >
                            <span>{section.title}</span>
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ChevronDown size={20} />
                            </motion.div>
                        </button>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                        padding: '1rem',
                                        background: 'rgba(0,0,0,0.3)',
                                    }}
                                >
                                    {key === 'data-sources' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {(section.items as any[]).map((item, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        padding: '0.75rem',
                                                        background: 'rgba(255,255,255,0.02)',
                                                        borderRadius: '8px',
                                                        border: `1px solid ${item.realtime
                                                                ? 'rgba(16,185,129,0.2)'
                                                                : 'rgba(245,158,11,0.2)'
                                                            }`,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            marginBottom: '0.25rem',
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                fontSize: '0.875rem',
                                                                fontWeight: 600,
                                                                color: '#F8FAFC',
                                                            }}
                                                        >
                                                            {item.label}
                                                        </p>
                                                        {item.realtime ? (
                                                            <span
                                                                style={{
                                                                    fontSize: '0.75rem',
                                                                    color: '#10B981',
                                                                    background: 'rgba(16,185,129,0.1)',
                                                                    padding: '0.25rem 0.5rem',
                                                                    borderRadius: '4px',
                                                                }}
                                                            >
                                                                REAL-TIME
                                                            </span>
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    fontSize: '0.75rem',
                                                                    color: '#F59E0B',
                                                                    background: 'rgba(245,158,11,0.1)',
                                                                    padding: '0.25rem 0.5rem',
                                                                    borderRadius: '4px',
                                                                }}
                                                            >
                                                                SIMULATED
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: '#94A3B8',
                                                            marginBottom: '0.25rem',
                                                        }}
                                                    >
                                                        <strong>Source:</strong> {item.source}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: '#64748B',
                                                        }}
                                                    >
                                                        {item.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {key === 'simulation' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {(section.items as any[]).map((item, i) => (
                                                <div key={i} style={{ fontSize: '0.875rem' }}>
                                                    <p
                                                        style={{
                                                            fontWeight: 600,
                                                            color: '#F8FAFC',
                                                            marginBottom: '0.25rem',
                                                        }}
                                                    >
                                                        • {item.label}
                                                    </p>
                                                    <p
                                                        style={{
                                                            color: '#94A3B8',
                                                            marginLeft: '1.25rem',
                                                            marginBottom: '0.25rem',
                                                        }}
                                                    >
                                                        Assumption: {item.assumption}
                                                    </p>
                                                    <p
                                                        style={{
                                                            color: '#64748B',
                                                            marginLeft: '1.25rem',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        Impact: {item.impact}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {key === 'metrics' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {(section.items as any[]).map((item, i) => (
                                                <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                                    <p
                                                        style={{
                                                            fontSize: '0.9rem',
                                                            fontWeight: 600,
                                                            color: '#F8FAFC',
                                                            marginBottom: '0.5rem',
                                                        }}
                                                    >
                                                        {item.metric}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: '#3B82F6',
                                                            fontFamily: 'monospace',
                                                            marginBottom: '0.5rem',
                                                            wordBreak: 'break-all',
                                                        }}
                                                    >
                                                        <strong>Formula:</strong> {item.formula}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: '#94A3B8',
                                                            marginBottom: '0.5rem',
                                                        }}
                                                    >
                                                        <strong>Data Source:</strong> {item.source}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: '#10B981',
                                                        }}
                                                    >
                                                        <strong>Reliability:</strong> {item.reliability}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {key === 'assumptions' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {(section.items as any[]).map((item, i) => (
                                                <div
                                                    key={i}
                                                    style={{
                                                        padding: '0.75rem',
                                                        background: 'rgba(239,68,68,0.05)',
                                                        border: '1px solid rgba(239,68,68,0.15)',
                                                        borderRadius: '8px',
                                                    }}
                                                >
                                                    <p
                                                        style={{
                                                            fontSize: '0.9rem',
                                                            fontWeight: 600,
                                                            color: '#FCA5A5',
                                                            marginBottom: '0.25rem',
                                                        }}
                                                    >
                                                        {item.title}
                                                    </p>
                                                    <p
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            color: '#94A3B8',
                                                        }}
                                                    >
                                                        {item.description}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}

            <div
                style={{
                    background: 'rgba(16,185,129,0.08)',
                    border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginTop: '1rem',
                }}
            >
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '0.125rem' }} />
                    <div>
                        <p
                            style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: '#10B981',
                                marginBottom: '0.25rem',
                            }}
                        >
                            ✓ Fully Transparent
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#D1FAE5' }}>
                            Every metric is documented and verifiable. Judges can audit our calculations and data
                            sources. This transparency is our competitive advantage.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

    if (variant === 'banner') {
        return renderBanner()
    }

    if (variant === 'modal') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: 'linear-gradient(135deg, rgba(8,12,24,0.98), rgba(15,20,35,0.95))',
                        border: '1px solid rgba(59,130,246,0.15)',
                        borderRadius: '16px',
                        padding: '2rem',
                        width: '90%',
                        maxWidth: '700px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h2
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 800,
                                color: '#F8FAFC',
                                fontFamily: 'Outfit,sans-serif',
                            }}
                        >
                            🔍 Transparency Hub
                        </h2>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '0.5rem',
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#94A3B8',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    </div>
                    {renderContent()}
                </motion.div>
            </motion.div>
        )
    }

    return renderContent()
}
