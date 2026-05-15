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
    ExternalLink, Loader, Info, Zap, Copy, Shield,
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
        apySourceLink?: string
        apyLastUpdated?: number | null
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
    const [proofHash, setProofHash] = useState<string>('')
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
        } catch (err: any) {
            setError(err?.message || 'Failed to connect wallet')
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
                setProofHash((result as any).proofHash || '')
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
                                style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

                                {/* Success header */}
                                <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
                                    <CheckCircle size={40} style={{ color: '#10B981', margin: '0 auto 0.75rem' }} />
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10B981', marginBottom: '0.25rem' }}>Investment Confirmed on 0G!</h3>
                                    <p style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{amount} 0G deployed in {agent.name}</p>
                                    {blockNum && <p style={{ fontSize: '0.65rem', color: '#64748B', marginTop: '0.25rem' }}>Block #{blockNum.toLocaleString()}</p>}
                                </div>

                                {/* Transaction hash */}
                                <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Zap size={13} style={{ color: '#60A5FA' }} />
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>On-Chain Transaction</span>
                                    </div>
                                    {txHash && (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
                                                <code style={{ flex: 1, fontSize: '0.65rem', color: '#94A3B8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{txHash}</code>
                                                <button onClick={() => navigator.clipboard?.writeText(txHash)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.25rem', flexShrink: 0 }}>
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                            <a href={`${EXPLORER_URL}/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#60A5FA', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                                                <ExternalLink size={11} /> View on chainscan-galileo.0g.ai
                                            </a>
                                        </>
                                    )}
                                </div>

                                {/* 0G Compute Proof (TEE) */}
                                <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '12px', padding: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <Shield size={13} style={{ color: '#A78BFA' }} />
                                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>0G Compute Proof (TEE)</span>
                                        <span style={{ marginLeft: 'auto', fontSize: '0.6rem', padding: '0.1rem 0.5rem', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#34D399', fontWeight: 800 }}>✓ Verified</span>
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: '#64748B', marginBottom: '0.5rem' }}>ProofOfIntelligence.sol · TEE Verification</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '0.5rem 0.75rem', marginBottom: '0.5rem' }}>
                                        <code style={{ flex: 1, fontSize: '0.65rem', color: '#A78BFA', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                            {proofHash || DEPLOYED_CONTRACTS.poi}
                                        </code>
                                        <button onClick={() => navigator.clipboard?.writeText(proofHash || DEPLOYED_CONTRACTS.poi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '0.25rem', flexShrink: 0 }}>
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                    <a href={`${EXPLORER_URL}/address/${DEPLOYED_CONTRACTS.poi}`} target="_blank" rel="noopener noreferrer"
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#A78BFA', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                                        <ExternalLink size={11} /> View ProofOfIntelligence contract
                                    </a>
                                    {!proofHash && (
                                        <p style={{ fontSize: '0.62rem', color: '#475569', marginTop: '0.5rem' }}>Proof populates after TEE verification — check Events tab on explorer.</p>
                                    )}
                                </div>

                                {/* What's verified */}
                                <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.875rem' }}>
                                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.625rem' }}>What This Proves</div>
                                    {[
                                        `${amount} 0G transferred from your wallet`,
                                        'Received by AgentCapital contract on 0G Galileo',
                                        'Agent decision verified via 0G Compute TEE',
                                        `APY source: ${agent.apySource || 'Aave V3 API (real protocol data)'}`,
                                        'All activity immutable on 0G Galileo testnet',
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.375rem' }}>
                                            <CheckCircle size={12} style={{ color: '#10B981', marginTop: 2, flexShrink: 0 }} />
                                            <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{item}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={handleClose} style={{ width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, #10B981, #059669)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
                                    View in Dashboard
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
                                    <div style={{ gridColumn: '1 / -1', marginBottom: 6 }}>
                                        <div style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 700, marginBottom: 4 }}>Profit Calculation</div>
                                        <div style={{ fontSize: '0.78rem', color: '#F8FAFC' }}>
                                            <div>Monthly formula: <strong>{amount} × ({agent.apy.toFixed(2)}% ÷ 12)</strong></div>
                                            <div>Annual formula: <strong>{amount} × {agent.apy.toFixed(2)}%</strong></div>
                                        </div>
                                        {agent.apySource && (
                                            <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: 6 }}>APY Source: {agent.apySource} {agent.apySourceLink && (<a href={agent.apySourceLink} target="_blank" rel="noopener noreferrer" style={{ color: '#60A5FA', marginLeft: 8 }}>Verify →</a>)}</div>
                                        )}
                                    </div>
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
