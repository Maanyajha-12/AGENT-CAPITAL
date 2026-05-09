/**
 * frontend/src/components/InvestModal.tsx
 * 
 * Real Web3 Investment Modal
 * Handles actual investment transactions on 0G Galileo testnet
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Wallet,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    ExternalLink,
    Loader,
} from 'lucide-react'
import {
    investInAgent,
    getWalletBalance,
    connectWallet,
    getExplorerUrl,
} from '../services/web3-investment'
import { getDemoInvestmentSimulation } from '../services/web3-investment'

interface InvestModalProps {
    isOpen: boolean
    onClose: () => void
    agent: {
        id: number
        name: string
        apy: number
        tvl: number
        winRate: number
        color: string
    }
}

export default function InvestModal({ isOpen, onClose, agent }: InvestModalProps) {
    const [amount, setAmount] = useState<string>('10')
    const [demoMode, setDemoMode] = useState(false)
    const [status, setStatus] = useState<
        'idle' | 'connecting' | 'approving' | 'confirmed' | 'error'
    >('idle')
    const [error, setError] = useState<string>('')
    const [txHash, setTxHash] = useState<string>('')
    const [walletAddress, setWalletAddress] = useState<string>('')
    const [balance, setBalance] = useState<string | null>(null)

    const handleConnect = async () => {
        setStatus('connecting')
        setError('')

        try {
            const address = await connectWallet()
            if (address) {
                setWalletAddress(address)
                const bal = await getWalletBalance(address)
                setBalance(bal)
                setStatus('idle')
            } else {
                setError('Failed to connect wallet. Using demo mode.')
                setDemoMode(true)
                setStatus('idle')
            }
        } catch (err) {
            setError('Failed to connect wallet')
            setStatus('error')
        }
    }

    const handleInvest = async () => {
        setStatus('approving')
        setError('')

        try {
            const amountNum = parseFloat(amount)
            if (isNaN(amountNum) || amountNum <= 0) {
                setError('Enter a valid amount')
                setStatus('error')
                return
            }

            let result

            // Use demo mode if wallet not connected
            if (!walletAddress || demoMode) {
                result = getDemoInvestmentSimulation(agent.id, amountNum)
                setDemoMode(true)
            } else {
                // Real Web3 transaction
                result = await investInAgent(agent.id, amountNum)
            }

            if (result.success) {
                setTxHash(result.txHash || '')
                setStatus('confirmed')
            } else {
                setError(result.error || 'Investment failed')
                setStatus('error')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Investment failed')
            setStatus('error')
        }
    }

    const handleClose = () => {
        setAmount('10')
        setStatus('idle')
        setError('')
        setTxHash('')
        setDemoMode(false)
        onClose()
    }

    const projectedReturn = (parseFloat(amount) || 0) * (agent.apy / 100 / 12)
    const projectedAnnual = (parseFloat(amount) || 0) * (agent.apy / 100)

    return (
        <AnimatePresence>
            {isOpen && (
                <div
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
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(135deg, rgba(8,12,24,0.98), rgba(15,20,35,0.95))',
                            border: '1px solid rgba(59,130,246,0.15)',
                            borderRadius: '20px',
                            padding: '2rem',
                            width: '90%',
                            maxWidth: '480px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                        }}
                    >
                        {/* Header */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <h2
                                style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 800,
                                    color: '#F8FAFC',
                                    fontFamily: 'Outfit,sans-serif',
                                }}
                            >
                                Invest in {agent.name}
                            </h2>
                            <button
                                onClick={handleClose}
                                style={{
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: '#94A3B8',
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Agent Info Card */}
                        <div
                            style={{
                                background: `linear-gradient(135deg, ${agent.color}10, rgba(59,130,246,0.05))`,
                                border: `1px solid ${agent.color}20`,
                                borderRadius: '16px',
                                padding: '1.25rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '12px',
                                        background: `linear-gradient(135deg, ${agent.color}30, ${agent.color}10)`,
                                        border: `1px solid ${agent.color}40`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    🤖
                                </div>
                                <div>
                                    <p
                                        style={{
                                            fontSize: '0.875rem',
                                            color: '#94A3B8',
                                            marginBottom: '0.25rem',
                                        }}
                                    >
                                        Strategy Info
                                    </p>
                                    <p
                                        style={{
                                            fontSize: '0.9rem',
                                            color: '#F8FAFC',
                                            fontWeight: 600,
                                        }}
                                    >
                                        TVL: ${(agent.tvl / 1000000).toFixed(1)}M • APY: {agent.apy}%
                                    </p>
                                    <p
                                        style={{
                                            fontSize: '0.8rem',
                                            color: '#10B981',
                                            marginTop: '0.25rem',
                                        }}
                                    >
                                        Win Rate: {agent.winRate}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Connection */}
                        {!walletAddress && !demoMode && (
                            <button
                                onClick={handleConnect}
                                disabled={status === 'connecting'}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#F8FAFC',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    opacity: status === 'connecting' ? 0.7 : 1,
                                }}
                            >
                                {status === 'connecting' ? (
                                    <>
                                        <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                        Connecting...
                                    </>
                                ) : (
                                    <>
                                        <Wallet size={16} />
                                        Connect MetaMask Wallet
                                    </>
                                )}
                            </button>
                        )}

                        {walletAddress && (
                            <div
                                style={{
                                    background: 'rgba(16,185,129,0.08)',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    marginBottom: '1rem',
                                    fontSize: '0.8rem',
                                    color: '#10B981',
                                    fontFamily: 'monospace',
                                }}
                            >
                                ✓ Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                                {balance && <div>Balance: {Number(balance).toFixed(2)} 0G</div>}
                            </div>
                        )}

                        {demoMode && (
                            <div
                                style={{
                                    background: 'rgba(245,158,11,0.08)',
                                    border: '1px solid rgba(245,158,11,0.2)',
                                    borderRadius: '12px',
                                    padding: '0.75rem',
                                    marginBottom: '1rem',
                                    fontSize: '0.8rem',
                                    color: '#FCD34D',
                                }}
                            >
                                ⚠️ Demo mode - No real transaction
                            </div>
                        )}

                        {/* Amount Input */}
                        {status === 'confirmed' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'rgba(16,185,129,0.08)',
                                    border: '1px solid rgba(16,185,129,0.3)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                }}
                            >
                                <CheckCircle
                                    size={48}
                                    style={{
                                        color: '#10B981',
                                        marginBottom: '1rem',
                                        margin: '0 auto 1rem',
                                    }}
                                />
                                <h3
                                    style={{
                                        fontSize: '1.125rem',
                                        fontWeight: 700,
                                        color: '#10B981',
                                        marginBottom: '0.5rem',
                                    }}
                                >
                                    Investment Confirmed!
                                </h3>
                                <p
                                    style={{
                                        color: '#94A3B8',
                                        fontSize: '0.875rem',
                                        marginBottom: '1rem',
                                    }}
                                >
                                    {amount} 0G invested in {agent.name}
                                </p>
                                {txHash && !demoMode && (
                                    <a
                                        href={getExplorerUrl(txHash)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: '#3B82F6',
                                            fontSize: '0.8rem',
                                            marginTop: '1rem',
                                            textDecoration: 'none',
                                            padding: '0.5rem 0.75rem',
                                            background: 'rgba(59,130,246,0.1)',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        View on Explorer
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                <button
                                    onClick={handleClose}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        background: 'linear-gradient(135deg, #10B981, #059669)',
                                        border: 'none',
                                        borderRadius: '10px',
                                        color: '#F8FAFC',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        marginTop: '1rem',
                                    }}
                                >
                                    Done
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            color: '#94A3B8',
                                            marginBottom: '0.5rem',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Investment Amount (0G)
                                    </label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        disabled={status !== 'idle' && status !== 'error'}
                                        step="0.1"
                                        min="0.1"
                                        placeholder="10"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '10px',
                                            color: '#F8FAFC',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                {/* Projections */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem',
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    <div
                                        style={{
                                            background: 'rgba(59,130,246,0.08)',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#94A3B8',
                                                marginBottom: '0.25rem',
                                                textTransform: 'uppercase',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Monthly Projection
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 800,
                                                color: '#3B82F6',
                                            }}
                                        >
                                            +${projectedReturn.toFixed(2)}
                                        </p>
                                    </div>
                                    <div
                                        style={{
                                            background: 'rgba(16,185,129,0.08)',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: '0.75rem',
                                                color: '#94A3B8',
                                                marginBottom: '0.25rem',
                                                textTransform: 'uppercase',
                                                fontWeight: 700,
                                            }}
                                        >
                                            Annual Projection (APY)
                                        </p>
                                        <p
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 800,
                                                color: '#10B981',
                                            }}
                                        >
                                            +${projectedAnnual.toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div
                                        style={{
                                            background: 'rgba(239,68,68,0.08)',
                                            border: '1px solid rgba(239,68,68,0.2)',
                                            borderRadius: '10px',
                                            padding: '0.875rem',
                                            marginBottom: '1rem',
                                            display: 'flex',
                                            gap: '0.75rem',
                                            fontSize: '0.875rem',
                                            color: '#FCA5A5',
                                        }}
                                    >
                                        <AlertCircle size={18} style={{ flexShrink: 0 }} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleInvest}
                                    disabled={status === 'approving' || !amount}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background:
                                            status === 'approving'
                                                ? 'rgba(59,130,246,0.3)'
                                                : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: '#F8FAFC',
                                        fontSize: '0.95rem',
                                        fontWeight: 700,
                                        cursor: status === 'approving' ? 'wait' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    {status === 'approving' ? (
                                        <>
                                            <Loader
                                                size={18}
                                                style={{ animation: 'spin 1s linear infinite' }}
                                            />
                                            Processing Investment...
                                        </>
                                    ) : (
                                        <>
                                            <ArrowUpRight size={18} />
                                            Invest {amount} 0G
                                        </>
                                    )}
                                </button>

                                <p
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#64748B',
                                        marginTop: '1rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    {demoMode
                                        ? 'Demo transaction (real MetaMask connection not available)'
                                        : 'You will be asked to confirm this transaction in your wallet.'}
                                </p>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
