import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Zap, Shield, TrendingUp, ChevronRight, CheckCircle, X, Sliders, Code } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const STRATEGIES = [
  { id: 'yield', name: 'Yield Harvester', emoji: '🌾', apy: '50–100%', color: 'var(--accent-maroon)', bg: '#eff6ff', risk: 4, desc: 'Multi-pool DeFi yield optimizer. Scans Aave, Curve, Balancer for best APY and auto-compounds every 24h.', targets: ['USDC', 'USDT', 'DAI'], protocols: ['Aave', 'Curve', 'Balancer'], sharpe: 1.94, drawdown: 8.2, winRate: 71.3, backtest: [60,62,65,61,68,72,75,74,78,82,84,87] },
  { id: 'volatility', name: 'Volatility Surfer', emoji: '🌊', apy: '80–150%', color: '#7c3aed', bg: '#f5f3ff', risk: 7, desc: 'Momentum trading that rides ETH/BTC swings. Catches 20%+ moves using on-chain sentiment signals.', targets: ['ETH', 'BTC', 'SOL'], protocols: ['Uniswap V4', 'dYdX', 'GMX'], sharpe: 1.67, drawdown: 15.2, winRate: 68.5, backtest: [55,70,65,80,75,90,82,95,88,100,92,108] },
  { id: 'arbitrage', name: 'Arbitrage Bot', emoji: '⚡', apy: '30–60%', color: '#d97706', bg: '#fffbeb', risk: 3, desc: 'Cross-DEX arbitrage executed in milliseconds. Targets price discrepancies across all major DEXes.', targets: ['All pairs'], protocols: ['Uniswap', 'Curve', 'Balancer', '0G DEX'], sharpe: 1.52, drawdown: 5.8, winRate: 74.2, backtest: [30,33,31,35,34,38,36,40,39,42,44,45] },
  { id: 'stable', name: 'Stablecoin Optimizer', emoji: '🛡️', apy: '20–40%', color: '#059669', bg: '#ecfdf5', risk: 2, desc: 'Ultra-safe stablecoin yield. Only USDC/USDT/DAI — zero liquidation risk. Perfect for conservative investors.', targets: ['USDC', 'USDT', 'DAI'], protocols: ['Aave', 'Compound', 'MakerDAO'], sharpe: 1.34, drawdown: 2.1, winRate: 89.1, backtest: [20,21,22,21,23,24,23,25,26,25,27,28] },
  { id: 'market', name: 'Market Maker', emoji: '💧', apy: '40–80%', color: '#0891b2', bg: '#ecfeff', risk: 5, desc: 'Concentrated liquidity provision on Uniswap V4. Earns swap fees on the highest-volume trading pairs.', targets: ['ETH/USDC', 'BTC/USDC'], protocols: ['Uniswap V4', 'Balancer'], sharpe: 1.28, drawdown: 9.1, winRate: 63.2, backtest: [40,42,41,44,43,47,46,50,48,52,54,56] },
  { id: 'shorting', name: 'Shorting Specialist', emoji: '📉', apy: '20–50%', color: '#dc2626', bg: '#fef2f2', risk: 8, desc: 'Profits in bear markets by shorting overvalued assets. Perfect hedge for your portfolio during downturns.', targets: ['ETH', 'BTC', 'Alts'], protocols: ['dYdX', 'GMX', 'Synthetix'], sharpe: 1.12, drawdown: 12.4, winRate: 58.7, backtest: [20,18,22,25,21,28,30,27,32,35,33,38] },
];

const ASSETS = ['USDC', 'USDT', 'DAI', 'ETH', 'BTC', 'SOL', 'ARB'];
const FREQS = ['Daily', 'Weekly', 'Monthly'];

function BacktestChart({ data, color }: { data: number[], color: string }) {
  const d = data.map((v, i) => ({ m: `M${i + 1}`, v }));
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={d}>
        <defs><linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.2} /><stop offset="95%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#g${color.replace('#','')})`} dot={false} />
        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${v}%`, 'APY']} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AgentBuilder({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('yield');
  const [riskTolerance, setRiskTolerance] = useState(5);
  const [targetApy, setTargetApy] = useState(70);
  const [selectedAssets, setSelectedAssets] = useState<string[]>(['USDC', 'USDT']);
  const [maxPosition, setMaxPosition] = useState(10000);
  const [rebalFreq, setRebalFreq] = useState('Daily');
  const [stopLoss, setStopLoss] = useState(true);
  const [multiSig, setMultiSig] = useState(true);
  const [gasProtection, setGasProtection] = useState(true);
  const [agentName, setAgentName] = useState('');
  const [deployed, setDeployed] = useState(false);

  const strat = STRATEGIES.find(s => s.id === template)!;

  const toggleAsset = (a: string) => setSelectedAssets(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  if (deployed) return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal-box" style={{ padding: '2.5rem', textAlign: 'center' }} onClick={e => e.stopPropagation()} initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Agent Deployed!</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>"{agentName || 'My Agent'}" is now live on 0G Chain.</p>
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'left' }}>
          <p>TX Hash: 0x{Math.random().toString(16).slice(2, 18)}...</p>
          <p>Contract: 0x{Math.random().toString(16).slice(2, 18)}...</p>
          <p>0G Verified: ✅ TEE Proof confirmed</p>
        </div>
        <button className="btn-primary" style={{ width: '100%' }} onClick={onClose}>View My Agent →</button>
      </motion.div>
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal-box" style={{ padding: '0', maxWidth: 680 }} onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Progress header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-default)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Agent Builder</h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}><X size={20} /></button>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Template', 'Parameters', 'Risk', 'Deploy'].map((s, i) => (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ height: 4, borderRadius: 99, background: step > i ? 'var(--accent-blue)' : 'var(--bg-elevated)' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: step > i ? 'var(--accent-blue)' : 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {STRATEGIES.map(s => (
                <button key={s.id} onClick={() => setTemplate(s.id)}
                  style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: `2px solid ${template === s.id ? s.color : 'var(--border-default)'}`, background: template === s.id ? s.bg : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{s.emoji}</span>
                    <span style={{ fontSize: '0.825rem', fontWeight: 700, color: template === s.id ? s.color : 'var(--text-primary)' }}>{s.name}</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.apy} APY · Risk {s.risk}/10</p>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Risk Tolerance: {riskTolerance}/10</label>
                <input type="range" min={1} max={10} value={riskTolerance} onChange={e => setRiskTolerance(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-blue)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                  <span>Conservative</span><span>Aggressive</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Target APY: {targetApy}%</label>
                <input type="range" min={20} max={200} value={targetApy} onChange={e => setTargetApy(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-blue)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Preferred Assets</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {ASSETS.map(a => (
                    <button key={a} onClick={() => toggleAsset(a)}
                      style={{ padding: '0.3rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none', background: selectedAssets.includes(a) ? 'var(--accent-blue)' : 'var(--bg-elevated)', color: selectedAssets.includes(a) ? '#fff' : 'var(--text-muted)' }}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Max Position Size: ${maxPosition.toLocaleString()}</label>
                <input type="range" min={1000} max={100000} step={1000} value={maxPosition} onChange={e => setMaxPosition(+e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-blue)' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Rebalance Frequency</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {FREQS.map(f => (
                    <button key={f} onClick={() => setRebalFreq(f)}
                      style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: `2px solid ${rebalFreq === f ? 'var(--accent-blue)' : 'var(--border-default)'}`, background: rebalFreq === f ? 'var(--maroon-light)' : '#fff', color: rebalFreq === f ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Stop-loss at -10%', desc: 'Auto-pause if portfolio drops 10%', val: stopLoss, set: setStopLoss },
                { label: 'Multi-sig for >$100k trades', desc: 'Requires 2-of-3 approval for large transactions', val: multiSig, set: setMultiSig },
                { label: 'Gas price protection', desc: 'Pause during high gas — saves fees', val: gasProtection, set: setGasProtection },
              ].map(({ label, desc, val, set }, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: val ? 'var(--accent-green-light)' : '#fff' }}>
                  <button onClick={() => set(!val)}
                    style={{ width: 44, height: 24, borderRadius: 99, background: val ? 'var(--accent-green)' : '#cbd5e1', border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: val ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                  </button>
                  <div>
                    <p style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                  {val && <CheckCircle size={16} style={{ color: 'var(--accent-green)', marginLeft: 'auto' }} />}
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Agent Name</label>
                <input value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="e.g. My Yield Master" className="input-field" />
              </div>
              <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Config Summary</p>
                {[
                  ['Strategy', strat.name], ['Target APY', `${targetApy}%`],
                  ['Risk Level', `${riskTolerance}/10`], ['Rebalance', rebalFreq],
                  ['Assets', selectedAssets.join(', ')], ['Max Position', `$${maxPosition.toLocaleString()}`],
                  ['Deploy Fee', '1 0G token (~$3.10)'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid var(--border-default)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{k}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-default)', display: 'flex', gap: '0.75rem' }}>
          {step > 1 && <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>Back</button>}
          <button className="btn-primary" style={{ flex: 2 }}
            onClick={() => { if (step < 4) setStep(s => s + 1); else setDeployed(true); }}>
            {step < 4 ? 'Continue →' : '🚀 Deploy Agent (1 0G)'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function StrategyPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Strategy Types</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>6 specialized AI strategies — each with 2-year backtests and live performance</p>
        </div>
        <button className="btn-primary" onClick={() => setShowBuilder(true)}>
          <Zap size={15} /> Build Custom Agent
        </button>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
        {STRATEGIES.map((s, i) => (
          <motion.div key={s.id} className="card" style={{ padding: '1.25rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            whileHover={{ y: -3 }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem', paddingTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>{s.emoji}</div>
                <div>
                  <p style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{s.name}</p>
                  <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Risk {s.risk}/10</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="font-display" style={{ fontSize: '1.25rem', fontWeight: 800, color: s.color }}>{s.apy}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>APY</p>
              </div>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', lineHeight: 1.6 }}>{s.desc}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '0.875rem' }}>
              {[['Sharpe', s.sharpe.toFixed(2)], ['Win Rate', `${s.winRate}%`], ['Drawdown', `-${s.drawdown}%`]].map(([l, v]) => (
                <div key={l} style={{ background: 'var(--bg-elevated)', borderRadius: '8px', padding: '0.375rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.58rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{l}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 800, color: l === 'Drawdown' ? '#dc2626' : s.color }}>{v}</p>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '0.875rem' }}>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>2-Year Backtest</p>
              <BacktestChart data={s.backtest} color={s.color} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
              {s.targets.map(t => <span key={t} style={{ padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 700, background: s.bg, color: s.color }}>{t}</span>)}
              {s.protocols.slice(0,2).map(p => <span key={p} style={{ padding: '0.15rem 0.5rem', borderRadius: '99px', fontSize: '0.65rem', fontWeight: 600, background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>{p}</span>)}
            </div>

            <AnimatePresence>
              {selected === s.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  style={{ borderTop: '1px solid var(--border-default)', paddingTop: '0.875rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>All Protocols</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.875rem' }}>
                    {s.protocols.map(p => <span key={p} style={{ padding: '0.2rem 0.6rem', borderRadius: '99px', fontSize: '0.72rem', fontWeight: 600, background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>{p}</span>)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button className="btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}
              onClick={e => { e.stopPropagation(); setShowBuilder(true); }}>
              Deploy this Strategy →
            </button>
          </motion.div>
        ))}
      </div>

      {showBuilder && <AgentBuilder onClose={() => setShowBuilder(false)} />}
    </div>
  );
}
