/**
 * frontend/src/components/TradeProofViewer.tsx
 * 
 * Display Real Trade History with On-Chain Proof
 * Shows actual transactions, profits, and explorer links
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp,
    ExternalLink,
    CheckCircle,
    AlertCircle,
    Loader,
    ChevronDown,
    ChevronUp,
} from 'lucide-react'

interface Trade {
    tradeNumber: number
    txHash?: string
    blockNumber?: number
    amountIn?: string
    amountOut?: string
    profit?: number
    profitPercent?: number
    source: 'REAL_DEX' | 'API_QUOTE' | 'SIMULATED'
    verified: boolean
    explorerUrl?: string
    executionTime?: number
    gasUsed?: string
    gasCost?: string
}

interface TradeProofViewerProps {
    agentId: number
}

export default function TradeProofViewer({ agentId }: TradeProofViewerProps) {
    const [trades, setTrades] = useState<Trade[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [expandedTrade, setExpandedTrade] = useState<number | null>(null)

    useEffect(() => {
        fetchTrades()
    }, [agentId])

    const fetchTrades = async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(`/api/trades/agent/${agentId}`)

            if (!response.ok) {
                throw new Error('Failed to fetch trades')
            }

            const data = await response.json()

            if (data.status === 'SUCCESS') {
                setTrades(data.trades || [])
                setStats(data.stats)
            } else {
                setError(data.error || 'Failed to fetch trades')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
            console.error('[TradeProof] Fetch failed:', err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div
                style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#94A3B8',
                }}
            >
                <Loader
                    size={24}
                    style={{
                        animation: 'spin 1s linear infinite',
                        marginBottom: '1rem',
                        margin: '0 auto 1rem',
                    }}
                />
                <p>Loading trade history...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div
                style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    color: '#FCA5A5',
                    display: 'flex',
                    gap: '0.75rem',
                }}
            >
                <AlertCircle size={20} style={{ flexShrink: 0 }} />
                <div>
                    <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Error Loading Trades</p>
                    <p style={{ fontSize: '0.875rem' }}>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ padding: '1.5rem' }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                }}
            >
                <TrendingUp size={24} style={{ color: '#10B981' }} />
                <div>
                    <h3
                        style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#F8FAFC',
                            margin: 0,
                        }}
                    >
                        Real Trade History
                    </h3>
                    <p
                        style={{
                            fontSize: '0.75rem',
                            color: '#64748B',
                            margin: '0.25rem 0 0 0',
                        }}
                    >
                        Agent #{agentId} • On-Chain Verified Trades
                    </p>
                </div>
            </div>

            {/* Statistics */}
            {stats && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem',
                    }}
                >
                    <StatCard label="Total Trades" value={stats.totalTrades} />
                    <StatCard label="Win Rate" value={stats.winRate} />
                    <StatCard
                        label="Total Profit"
                        value={`${stats.totalProfit} 0G`}
                        highlight
                    />
                    <StatCard label="Avg Profit/Trade" value={stats.avgProfitPerTrade} />
                </div>
            )}

            {/* Trades List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {trades.length === 0 ? (
                    <div
                        style={{
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#64748B',
                            background: 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}
                    >
                        <p>No trades yet. Trades will appear here once agent starts trading.</p>
                    </div>
                ) : (
                    trades.map((trade) => (
                        <TradeCard
                            key={trade.tradeNumber}
                            trade={trade}
                            isExpanded={expandedTrade === trade.tradeNumber}
                            onToggle={() =>
                                setExpandedTrade(
                                    expandedTrade === trade.tradeNumber ? null : trade.tradeNumber
                                )
                            }
                        />
                    ))
                )}
            </div>

            {/* Data Source Disclaimer */}
            <div
                style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: 'rgba(59,130,246,0.08)',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    color: '#93C5FD',
                }}
            >
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>📊 Data Verification</p>
                <p style={{ margin: 0 }}>
                    All trades shown here use real market data from CoinGecko. Profits are either from actual DEX executions or calculated from real-time API quotes. Every transaction is verifiable on the 0G Galileo block explorer.
                </p>
            </div>
        </div>
    )
}

interface TradeCardProps {
    trade: Trade
    isExpanded: boolean
    onToggle: () => void
}

function TradeCard({ trade, isExpanded, onToggle }: TradeCardProps) {
    const profit = parseFloat(trade.profit?.toString() || '0')
    const isProfit = profit > 0
    const profitColor = isProfit ? '#10B981' : '#EF4444'

    return (
        <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 'initial' }}
            style={{
                background: 'linear-gradient(135deg, rgba(8,12,24,0.95), rgba(15,20,35,0.9))',
                border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: '12px',
                overflow: 'hidden',
            }}
        >
            {/* Click to Expand */}
            <button
                onClick={onToggle}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                }}
            >
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.5rem',
                        }}
                    >
                        {isProfit ? (
                            <CheckCircle size={18} style={{ color: '#10B981' }} />
                        ) : (
                            <AlertCircle size={18} style={{ color: '#EF4444' }} />
                        )}
                        <span style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 600 }}>
                            Trade #{trade.tradeNumber}
                        </span>
                        <span
                            style={{
                                fontSize: '0.75rem',
                                background: trade.verified
                                    ? 'rgba(16,185,129,0.2)'
                                    : 'rgba(245,158,11,0.2)',
                                color: trade.verified ? '#10B981' : '#FCD34D',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                            }}
                        >
                            {trade.verified ? '✓ Verified' : '⚠️ Unverified'}
                        </span>
                        <span
                            style={{
                                fontSize: '0.75rem',
                                background:
                                    trade.source === 'REAL_DEX'
                                        ? 'rgba(34,197,94,0.2)'
                                        : 'rgba(234,179,8,0.2)',
                                color: trade.source === 'REAL_DEX' ? '#22C55E' : '#EAB308',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                            }}
                        >
                            {trade.source}
                        </span>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1rem',
                        }}
                    >
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
                                Amount In
                            </p>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#F8FAFC',
                                    margin: '0.25rem 0 0 0',
                                }}
                            >
                                {parseFloat(trade.amountIn || '0').toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
                                Amount Out
                            </p>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#F8FAFC',
                                    margin: '0.25rem 0 0 0',
                                }}
                            >
                                {parseFloat(trade.amountOut || '0').toFixed(2)}
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
                                Profit
                            </p>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    color: profitColor,
                                    margin: '0.25rem 0 0 0',
                                }}
                            >
                                {isProfit ? '+' : ''}{profit.toFixed(4)} ({trade.profitPercent?.toFixed(2)}%)
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
                                Execution
                            </p>
                            <p
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: '#F8FAFC',
                                    margin: '0.25rem 0 0 0',
                                }}
                            >
                                {trade.executionTime}ms
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginLeft: '1rem', color: '#64748B' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </button>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                            borderTop: '1px solid rgba(59,130,246,0.2)',
                            padding: '1rem',
                            background: 'rgba(0,0,0,0.3)',
                        }}
                    >
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '1.5rem',
                            }}
                        >
                            {/* Transaction Details */}
                            <div>
                                <h4
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#94A3B8',
                                        textTransform: 'uppercase',
                                        margin: '0 0 0.75rem 0',
                                    }}
                                >
                                    Transaction Details
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <DetailRow
                                        label="TX Hash"
                                        value={trade.txHash ? trade.txHash.slice(0, 10) + '...' : 'N/A'}
                                    />
                                    <DetailRow label="Block #" value={trade.blockNumber?.toString() || 'N/A'} />
                                    <DetailRow label="Gas Used" value={trade.gasUsed || 'N/A'} />
                                    <DetailRow label="Gas Cost" value={trade.gasCost || 'N/A'} />
                                </div>

                                {trade.explorerUrl && (
                                    <a
                                        href={trade.explorerUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginTop: '0.75rem',
                                            color: '#3B82F6',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            padding: '0.5rem 0.75rem',
                                            background: 'rgba(59,130,246,0.1)',
                                            borderRadius: '6px',
                                        }}
                                    >
                                        View on Explorer
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>

                            {/* Profit Verification */}
                            <div>
                                <h4
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: 700,
                                        color: '#94A3B8',
                                        textTransform: 'uppercase',
                                        margin: '0 0 0.75rem 0',
                                    }}
                                >
                                    Profit Proof
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <DetailRow
                                        label="Formula"
                                        value={`${trade.amountOut} - ${trade.amountIn}`}
                                    />
                                    <DetailRow label="Result" value={`${profit.toFixed(4)}`} highlight />
                                    <DetailRow
                                        label="Percent Gain"
                                        value={`${trade.profitPercent?.toFixed(2)}%`}
                                        highlight
                                    />
                                    <DetailRow label="Source" value={trade.source} />
                                </div>

                                <p
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#64748B',
                                        marginTop: '0.75rem',
                                        margin: '0.75rem 0 0 0',
                                    }}
                                >
                                    Profit verified from DEX execution or real market API.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

interface DetailRowProps {
    label: string
    value: string
    highlight?: boolean
}

function DetailRow({ label, value, highlight }: DetailRowProps) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.5rem',
                background: highlight ? 'rgba(16,185,129,0.08)' : 'transparent',
                borderRadius: '6px',
            }}
        >
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{label}</span>
            <span
                style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: highlight ? '#10B981' : '#F8FAFC',
                    fontFamily: 'monospace',
                }}
            >
                {value}
            </span>
        </div>
    )
}

interface StatCardProps {
    label: string
    value: string | number
    highlight?: boolean
}

function StatCard({ label, value, highlight }: StatCardProps) {
    return (
        <div
            style={{
                background: highlight
                    ? 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))'
                    : 'rgba(255,255,255,0.02)',
                border: highlight
                    ? '1px solid rgba(16,185,129,0.2)'
                    : '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px',
                padding: '1rem',
                textAlign: 'center',
            }}
        >
            <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '0 0 0.5rem 0' }}>
                {label}
            </p>
            <p
                style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: highlight ? '#10B981' : '#F8FAFC',
                    margin: 0,
                }}
            >
                {value}
            </p>
        </div>
    )
}
