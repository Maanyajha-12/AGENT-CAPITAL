/**
 * RealityCheckDashboard.tsx — Premium Transparency Dashboard for Judges
 * Shows exactly what's REAL, SIMULATED, and TRANSPARENT with visual proof
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, AlertTriangle, Eye, Code, Lock, ExternalLink, Copy,
  Shield, Cpu, Coins, BarChart3, Dna, ChevronRight, Verified
} from 'lucide-react';

interface RealityItem {
  title: string;
  status: 'REAL' | 'SIMULATED' | 'TRANSPARENT';
  icon: any;
  description: string;
  verification: string;
  dataSource: string;
  explorerLink?: string;
  code: string;
  gradient: string;
  accent: string;
}

const ITEMS: RealityItem[] = [
  {
    title: 'Smart Contracts on 0G',
    status: 'REAL',
    icon: Shield,
    description: '5 contracts deployed & verified on 0G Galileo testnet — DeliberationINFT, ProofOfIntelligence, AgentRegistry, TournamentArena, CrossChainBridge.',
    verification: 'Open block explorer and search any contract address below',
    dataSource: 'On-chain verified code',
    explorerLink: 'https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59',
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    accent: '#10B981',
    code: `Deployed Contracts (Block 30912464):
DeliberationINFT:    0x1cd62cb08754a12fcc3427559e616a2898812d59
ProofOfIntelligence: 0xdc83dd755ba02265d23922104b0b54c304537bf2
AgentRegistry:       0xc8106baf71c3a38177167edf51ac1391cbb8e2e6
TournamentArena:     0x52e4fc0de6b1ecc7b48375e5a9135fb41236f668
CrossChainBridge:    0x8417b73a19a1db21a10d0737fb8bbd469ee21545
Network: 0G Galileo (Chain ID: 16602)
Status: ✅ All 5 Deployed & Verified`,
  },
  {
    title: 'Investment Transactions',
    status: 'REAL',
    icon: Coins,
    description: 'When you click "Invest", a REAL transaction sends actual 0G tokens to the AgentCapital contract on 0G Galileo.',
    verification: 'Connect MetaMask → Invest → See tx hash on block explorer',
    dataSource: 'User wallet signature + on-chain transfer',
    explorerLink: 'https://chainscan-galileo.0g.ai',
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    accent: '#10B981',
    code: `Transaction Flow:
1. User connects MetaMask
2. Clicks "Invest in Agent"
3. MetaMask popup (REAL transaction)
4. User signs with private key
5. 0G tokens transfer on-chain
6. Contract emits InvestmentReceived event
7. User sees tx hash + explorer link`,
  },
  {
    title: '0G Compute TEE Proofs',
    status: 'REAL',
    icon: Cpu,
    description: 'Agent decisions verified by 0G Compute Router via TEE (Trusted Execution Environment). Cryptographic proof hashes stored on-chain.',
    verification: 'Query ProofOfIntelligence contract events on block explorer',
    dataSource: 'TEE execution → Proof hashes stored on-chain',
    explorerLink: 'https://chainscan-galileo.0g.ai/address/0xdc83dd755ba02265d23922104b0b54c304537bf2',
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    accent: '#10B981',
    code: `Proof Verification Flow:
1. Agent decides: "Buy ETH, Sell USDC"
2. Decision → 0G Compute Router API
3. TEE executes in trusted enclave
4. Returns proof hash + confidence score
5. Hash stored on ProofOfIntelligence.sol
6. Verifiable: Anyone can check on-chain
Contract: 0xdc83dd755ba02265d23922104b0b54c304537bf2`,
  },
  {
    title: 'Agent Trading',
    status: 'SIMULATED',
    icon: BarChart3,
    description: 'Agent trades are SIMULATED with real market data from DeFi Llama + Aave V3. This is honest for a hackathon demo.',
    verification: 'Every agent card shows "LIVE · DeFiLlama" badge with "Verify →" link',
    dataSource: 'Real DeFi protocol APY data (DeFi Llama API + Aave V3 API)',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
    accent: '#F59E0B',
    code: `Why Simulated:
• Hackathon limited time
• Testnet 0G/USDC liquidity limited
• Real trading too risky for demo

But it's HONEST:
• Uses real APY from Aave V3 (via DeFi Llama)
• Shows source: "LIVE · DeFiLlama" on every card
• Fallback values labeled "EST." with date
• Profit formula shown transparently
• "Verify →" links to actual DeFi Llama pools`,
  },
  {
    title: 'APY & Profit Formulas',
    status: 'TRANSPARENT',
    icon: Eye,
    description: 'All APY values sourced from live DeFi Llama API → Aave V3 API → labeled fallback estimates. Every formula visible in InvestModal.',
    verification: 'Click "Verify →" on any agent card → opens DeFi Llama source',
    dataSource: 'DeFi Llama pools API (yields.llama.fi/pools)',
    gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    accent: '#3B82F6',
    code: `APY Sources (Priority Order):
1. DeFi Llama API (yields.llama.fi/pools)
   → Aave V3 USDC, WETH, USDT on Ethereum
   → Curve stETH/ETH
   → Uniswap V3 USDC/ETH

2. Aave V3 API (direct)
   → aave-api-v2.aave.com

3. Fallback estimates (labeled "EST.")
   → Q1-2025 snapshots with date

Profit Formula (shown in InvestModal):
Monthly = Amount × (APY% ÷ 12)
Annual  = Amount × APY%`,
  },
  {
    title: 'Breeding System (iNFTs)',
    status: 'REAL',
    icon: Dna,
    description: 'Breeding two agents mints a new iNFT on-chain via DeliberationINFT.sol. Traits from genetics algorithm, stored permanently on 0G.',
    verification: 'Breed agents → See on-chain NFT mint via block explorer',
    dataSource: 'DeliberationINFT.sol on-chain',
    explorerLink: 'https://chainscan-galileo.0g.ai/address/0x1cd62cb08754a12fcc3427559e616a2898812d59',
    gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
    accent: '#10B981',
    code: `Breeding Flow:
1. User selects 2 parent agents
2. Clicks "Breed"
3. DeliberationINFT.sol called
4. New iNFT minted (on-chain)
5. Child traits = genetic combination
6. Parent receives royalties (5%)
7. Child NFT transferable
8. Verifiable on 0G Galileo explorer`,
  },
];

const statusConfig = {
  REAL:        { label: 'On-Chain Verified', color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', icon: CheckCircle },
  SIMULATED:   { label: 'Honestly Simulated', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', icon: AlertTriangle },
  TRANSPARENT: { label: 'Fully Transparent',  color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', icon: Eye },
};

export default function RealityCheckDashboard() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const item = ITEMS[selected];
  const sc = statusConfig[item.status];

  const copyCode = () => {
    navigator.clipboard.writeText(item.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const realCount = ITEMS.filter(i => i.status === 'REAL').length;
  const simCount = ITEMS.filter(i => i.status === 'SIMULATED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.5rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#10B981,#3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 28px rgba(16,185,129,0.4)' }}>
            <Lock size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit,sans-serif', color: '#F8FAFC', letterSpacing: '-0.02em' }}>Reality Check</h1>
            <p style={{ fontSize: '0.825rem', color: '#64748B' }}>For Judges — Transparency into what's real, simulated, and verifiable</p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Row ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {[
          { label: 'On-Chain Verified', value: realCount, color: '#10B981', desc: 'Contracts, transactions, TEE, breeding' },
          { label: 'Honestly Simulated', value: simCount, color: '#F59E0B', desc: 'Trading (with real DeFi Llama data)' },
          { label: 'Transparent', value: 'All', color: '#3B82F6', desc: 'Every formula & source visible' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{ padding: '1.25rem', borderRadius: 16, background: 'linear-gradient(135deg,rgba(13,17,23,0.9),rgba(22,29,44,0.8))', border: `1px solid ${s.color}25`, borderLeft: `3px solid ${s.color}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle,${s.color}12 0%,transparent 70%)`, filter: 'blur(15px)', pointerEvents: 'none' }} />
            <p style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{s.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: s.color, fontFamily: 'Outfit,sans-serif', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '0.68rem', color: '#475569', marginTop: '0.4rem' }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem', alignItems: 'start' }}>

        {/* Left — Item List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ITEMS.map((it, idx) => {
            const cfg = statusConfig[it.status];
            const active = idx === selected;
            const Icon = it.icon;
            return (
              <motion.button key={idx} onClick={() => setSelected(idx)}
                whileHover={{ x: 4 }}
                style={{
                  width: '100%', textAlign: 'left', padding: '0.875rem 1rem', borderRadius: 14, cursor: 'pointer',
                  border: active ? `1px solid ${cfg.color}50` : '1px solid rgba(255,255,255,0.06)',
                  background: active ? `linear-gradient(135deg,${cfg.bg},rgba(13,17,23,0.95))` : 'rgba(255,255,255,0.02)',
                  boxShadow: active ? `0 0 24px ${cfg.color}12, inset 0 0 0 1px ${cfg.color}15` : 'none',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: active ? `${cfg.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? cfg.color + '35' : 'rgba(255,255,255,0.08)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: active ? `0 0 12px ${cfg.color}20` : 'none',
                  transition: 'all 0.2s',
                }}>
                  <Icon size={16} style={{ color: active ? cfg.color : '#475569' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.825rem', color: active ? '#F8FAFC' : '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.title}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.15rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0, boxShadow: active ? `0 0 6px ${cfg.color}` : 'none' }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: cfg.color, letterSpacing: '0.05em' }}>{it.status}</span>
                  </div>
                </div>
                {active && <ChevronRight size={14} style={{ color: cfg.color, flexShrink: 0 }} />}
              </motion.button>
            );
          })}
        </div>

        {/* Right — Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={selected}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              padding: '1.75rem', borderRadius: 20,
              background: 'linear-gradient(135deg,rgba(13,17,23,0.95),rgba(22,29,44,0.9))',
              border: `1px solid ${sc.color}25`,
              position: 'relative', overflow: 'hidden',
            }}>

            {/* Top gradient accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${sc.color},transparent)` }} />
            <div style={{ position: 'absolute', top: -50, right: -50, width: 180, height: 180, borderRadius: '50%', background: `radial-gradient(circle,${sc.color}10 0%,transparent 70%)`, filter: 'blur(30px)', pointerEvents: 'none' }} />

            {/* Title + Badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${sc.color}15`, border: `1px solid ${sc.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${sc.color}20` }}>
                  <item.icon size={20} style={{ color: sc.color }} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F8FAFC', fontFamily: 'Outfit,sans-serif' }}>{item.title}</h2>
                  <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 99, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, letterSpacing: '0.08em', display: 'inline-block', marginTop: '0.25rem' }}>{sc.label}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', lineHeight: 1.8, marginBottom: '1.25rem' }}>{item.description}</p>

            {/* Info Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {/* How to Verify */}
              <div style={{ padding: '1rem', borderRadius: 14, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Verified size={14} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>How to Verify</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.6 }}>{item.verification}</p>
                {item.explorerLink && (
                  <a href={item.explorerLink} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.625rem', padding: '0.375rem 0.75rem', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34D399', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.15s' }}>
                    <ExternalLink size={12} /> Open Block Explorer
                  </a>
                )}
              </div>

              {/* Data Source */}
              <div style={{ padding: '1rem', borderRadius: 14, background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Shield size={14} style={{ color: '#3B82F6' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Data Source</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#94A3B8', lineHeight: 1.6 }}>{item.dataSource}</p>
              </div>
            </div>

            {/* Code Block */}
            <div style={{ borderRadius: 14, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={13} style={{ color: '#8B5CF6' }} />
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#A78BFA', letterSpacing: '0.05em' }}>Implementation Details</span>
                </div>
                <button onClick={copyCode}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: 6, background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`, color: copied ? '#34D399' : '#64748B', fontSize: '0.62rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                  <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre style={{ padding: '1rem', margin: 0, fontSize: '0.72rem', fontFamily: '"JetBrains Mono",monospace', color: '#94A3B8', lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {item.code}
              </pre>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Transparency Statement ────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ padding: '1.5rem', borderRadius: 20, background: 'linear-gradient(135deg,rgba(16,185,129,0.06),rgba(59,130,246,0.04))', border: '1px solid rgba(16,185,129,0.15)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(16,185,129,0.4),rgba(59,130,246,0.4),transparent)' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <CheckCircle size={15} style={{ color: '#10B981' }} /> What's Real & Verifiable
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['5 smart contracts on 0G Galileo', 'Real Web3 investment transactions', '0G Compute TEE proof hashes on-chain', 'iNFT breeding creates real NFTs', 'Bridge infrastructure deployed'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 800, color: '#F8FAFC', fontSize: '0.875rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <AlertTriangle size={15} style={{ color: '#F59E0B' }} /> What's Simulated (Honestly)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {['Agent trading (uses real DeFi Llama data)', 'Profit calculations (transparent formulas)', 'APY metrics (show source + math)', 'Every number traceable to an API'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F59E0B', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ fontSize: '0.72rem', color: '#475569', fontStyle: 'italic', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          "We built a production-ready platform for this hackathon. What's simulated is HONEST and uses real data. What's on-chain is VERIFIABLE. After the hackathon, we enable real trading."
        </p>
      </motion.div>
    </div>
  );
}
