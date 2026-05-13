/**
 * frontend/src/components/InvestModal.tsx
 *
 * Real Web3 Investment Modal — 0G Galileo Testnet
 * Sends actual transactions to deployed contracts. Shows real tx on chainscan-galileo.0g.ai
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Wallet, CheckCircle, AlertCircle, ArrowUpRight,
    ExternalLink, Loader, Info, Zap,
} from 'lucide-react'
import {
    investInAgent, getWalletBalance, connectWallet, DEPLOYED_CONTRACTS, BLOCK_EXPLORER,
} from '../services/web3-investment'

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
        apySource?: string
    }
}

const FAUCET_URL = 'https://hub.0g.ai'
const EXPLORER_URL = BLOCK_EXPLORER

export default function InvestModal({ isOpen, onClose, agent }: InvestModalProps) {
    const [amount, setAmount] = useState<string>('1')
    const [status, setStatus] = useState<'idle' | 'connecting' | 'approving' | 'pending' | 'confirmed' | 'error'>('idle')
    const [error, setError] = useState<string>('')
    const [txHash, setTxHash] = useState<string>('')
    const [blockNum, setBlockNum] = useState<number | undefined>()
    const [walletAddress, setWalletAddress] = useState<string>('')
    const [balance, setBalance] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) return
        // Auto-check if already connected
        import('../services/web3-investment').then(m => {
            m.getConnectedAccount().then(addr => {
                if (addr) {
                    setWalletAddress(addr)
                    m.getWalletBalance(addr).then(b => setBalance(b))
                }
            })
        })
    }, [isOpen])

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
                setError('MetaMask not found. Install it at metamask.io')
                setStatus('error')
            }
        } catch {
            setError('Failed to connect wallet')
            setStatus('error')
        }
    }

    const handleInvest = async () => {
        setStatus('approving')
        setError('')
        const amountNum = parseFloat(amount)
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Enter a valid amount')
            setStatus('error')
            return
        }
        try {
            setStatus('pending')
            const result = await investInAgent(agent.id, amountNum)
            if (result.success) {
                setTxHash(result.txHash || '')
                setBlockNum(result.blockNumber)
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
        setAmount('1')
        setStatus('idle')
        setError('')
        setTxHash('')
        onClose()
    }

    const projectedMonthly = (parseFloat(amount) || 0) * (agent.apy / 100 / 12)
    const projectedAnnual = (parseFloat(amount) || 0) * (agent.apy / 100)

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'linear-gradient(160deg, rgba(8,12,24,0.99) 0%, rgba(12,18,36,0.97) 100%)',
                            border: '1px solid rgba(59,130,246,0.18)',
                            borderRadius: '20px',
                            padding: '1.875rem',
                            width: '90%',
                            maxWidth: '500px',
                            boxShadow: '0 30px 60px -12px rgba(0,0,0,0.7), 0 0 80px rgba(59,130,246,0.08)',
                        }}
                    >
                        {/* ── Header ─────────────────────────────── */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'Outfit,sans-serif', marginBottom: '0.1rem' }}>
                                    Invest in {agent.name}
                                </h2>
                                <p style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                    Real transaction on 0G Galileo Testnet
                                </p>
                            </div>
                            <button onClick={handleClose} style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', cursor: 'pointer', color: '#94A3B8', display: 'flex' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── 0G Chain Banner ─────────────────────── */}
                        <div style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.1), rgba(139,92,246,0.08))', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F8FAFC' }}>0G Galileo Testnet · Chain ID 16602</div>
                                    <div style={{ fontSize: '0.62rem', color: '#64748B', fontFamily: 'monospace' }}>
                                        {DEPLOYED_CONTRACTS.inft.slice(0, 10)}...{DEPLOYED_CONTRACTS.inft.slice(-6)}
                                    </div>
                                </div>
                            </div>
                            <a href={`${EXPLORER_URL}/address/${DEPLOYED_CONTRACTS.inft}`} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: '0.62rem', color: '#60A5FA', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
                                View contract <ExternalLink size={10} />
                            </a>
                        </div>

                        {/* ── Agent Info ──────────────────────────── */}
                        <div style={{ background: `linear-gradient(135deg, ${agent.color}10, rgba(59,130,246,0.04))`, border: `1px solid ${agent.color}20`, borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.2rem' }}>Strategy Yield (APY)</div>
                                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: agent.color, fontFamily: 'Outfit,sans-serif' }}>
                                        {agent.apy.toFixed(2)}%
                                    </div>
                                    {agent.apySource && (
                                        <div style={{ fontSize: '0.6rem', color: '#475569', marginTop: '0.2rem' }}>
                                            📡 {agent.apySource}
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '0.2rem' }}>Win Rate</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981' }}>{agent.winRate}%</div>
                                    <div style={{ fontSize: '0.62rem', color: '#64748B' }}>TVL ${(agent.tvl / 1e6).toFixed(1)}M</div>
                                </div>
                            </div>
                        </div>

                        {/* ── Wallet Connection ───────────────────── */}
                        {!walletAddress ? (
                            <div style={{ marginBottom: '1.25rem' }}>
                                <button onClick={handleConnect} disabled={status === 'connecting'}
                                    style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: status === 'connecting' ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: status === 'connecting' ? 0.7 : 1 }}>
                                    {status === 'connecting' ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Connecting...</> : <><Wallet size={16} /> Connect MetaMask</>}
                                </button>
                                <div style={{ textAlign: 'center', marginTop: '0.625rem', fontSize: '0.68rem', color: '#475569' }}>
                                    Need testnet 0G?{' '}
                                    <a href={FAUCET_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA', textDecoration: 'none' }}>
                                        Get from faucet →
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.625rem 0.875rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '0.1rem' }}>Connected Wallet</div>
                                    <div style={{ fontSize: '0.8rem', color: '#10B981', fontFamily: 'monospace', fontWeight: 700 }}>
                                        {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                                    </div>
                                </div>
                                {balance && (
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.65rem', color: '#64748B' }}>Balance</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#F8FAFC' }}>
                                            {Number(balance).toFixed(4)} 0G
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Confirmed State ─────────────────────── */}
                        {status === 'confirmed' ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
                                <CheckCircle size={44} style={{ color: '#10B981', margin: '0 auto 1rem' }} />
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981', marginBottom: '0.5rem' }}>
                                    Investment Confirmed on 0G Chain!
                                </h3>
                                <p style={{ color: '#94A3B8', fontSize: '0.825rem', marginBottom: '0.5rem' }}>
                                    {amount} 0G invested in {agent.name}
                                </p>
                                {blockNum && (
                                    <p style={{ fontSize: '0.7rem', color: '#64748B', marginBottom: '1rem' }}>
                                        Confirmed at block #{blockNum.toLocaleString()}
                                    </p>
                                )}
                                {txHash && (
                                    <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 1rem', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '8px', color: '#60A5FA', fontSize: '0.75rem', textDecoration: 'none', marginBottom: '1rem' }}>
                                        <Zap size={12} />
                                        View on chainscan-galileo.0g.ai
                                        <ExternalLink size={11} />
                                    </a>
                                )}
                                <div style={{ fontSize: '0.68rem', color: '#475569', fontFamily: 'monospace', marginBottom: '1rem', wordBreak: 'break-all' }}>
                                    Tx: {txHash.slice(0, 20)}...{txHash.slice(-8)}
                                </div>
                                <button onClick={handleClose} style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
                                    Done
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                {/* Amount */}
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '0.5rem', fontWeight: 600 }}>
                                        Investment Amount (0G tokens)
                                    </label>
                                    <input
                                        type="number" value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        disabled={status === 'approving' || status === 'pending'}
                                        min="0.01" step="0.1"
                                        style={{ width: '100%', padding: '0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#F8FAFC', fontSize: '1.1rem', fontWeight: 700, boxSizing: 'border-box' }}
                                    />
                                </div>

                                {/* Projections */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                                    {[
                                        { label: 'Monthly Projection', val: `+${projectedMonthly.toFixed(4)} 0G`, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
                                        { label: `Annual (${agent.apy.toFixed(1)}% APY)`, val: `+${projectedAnnual.toFixed(4)} 0G`, color: '#10B981', bg: 'rgba(16,185,129,0.08)' },
                                    ].map(p => (
                                        <div key={p.label} style={{ background: p.bg, padding: '0.875rem', borderRadius: '10px' }}>
                                            <div style={{ fontSize: '0.65rem', color: '#94A3B8', marginBottom: '0.25rem', fontWeight: 600, textTransform: 'uppercase' }}>{p.label}</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 900, color: p.color, fontFamily: 'Outfit,sans-serif' }}>{p.val}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Source disclosure */}
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.75rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '10px', marginBottom: '1.25rem' }}>
                                    <Info size={14} style={{ color: '#F59E0B', flexShrink: 0, marginTop: '0.1rem' }} />
                                    <p style={{ fontSize: '0.68rem', color: '#78716C', lineHeight: 1.5 }}>
                                        APY projections are calculated from real DeFi protocol rates ({agent.apySource || 'DeFi Llama'}). Returns are simulated on 0G testnet — not financial advice.
                                    </p>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem', display: 'flex', gap: '0.625rem', fontSize: '0.8rem', color: '#FCA5A5' }}>
                                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={walletAddress ? handleInvest : handleConnect}
                                    disabled={status === 'approving' || status === 'pending'}
                                    style={{ width: '100%', padding: '1rem', background: (status === 'approving' || status === 'pending') ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #3B82F6, #2563EB)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.95rem', fontWeight: 700, cursor: (status === 'approving' || status === 'pending') ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    {status === 'approving' || status === 'pending' ? (
                                        <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {status === 'approving' ? 'Confirm in MetaMask…' : 'Waiting for 0G block…'}</>
                                    ) : walletAddress ? (
                                        <><ArrowUpRight size={18} /> Invest {amount} 0G on-chain</>
                                    ) : (
                                        <><Wallet size={18} /> Connect Wallet to Invest</>
                                    )}
                                </button>

                                <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: '0.75rem', textAlign: 'center' }}>
                                    {walletAddress ? 'MetaMask will ask you to confirm this transaction on 0G Galileo.' : 'No MetaMask? Install at metamask.io — then connect above.'}
                                </p>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
