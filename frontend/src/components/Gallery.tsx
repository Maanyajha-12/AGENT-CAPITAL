import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Zap, Trophy, TrendingUp, ArrowUpRight, CheckCircle, Star, Shield, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AGENTS = [
  { id: 1, name: 'Yield Harvester+', gen: 3, apy: 87.3, accuracy: 92, winRate: 71.3, sharpe: 1.94, color: 'var(--accent-maroon)', verified: true },
  { id: 2, name: 'Volatility Surge', gen: 2, apy: 76.1, accuracy: 84, winRate: 68.5, sharpe: 1.67, color: '#7c3aed', verified: true },
  { id: 3, name: 'Arbitrage Master', gen: 1, apy: 72.8, accuracy: 88, winRate: 74.2, sharpe: 1.52, color: '#d97706', verified: true },
  { id: 4, name: 'Stablecoin Pro',   gen: 0, apy: 48.2, accuracy: 94, winRate: 89.1, sharpe: 1.34, color: '#059669', verified: true },
  { id: 5, name: 'Epsilon Core',     gen: 4, apy: 95.0, accuracy: 95, winRate: 78.4, sharpe: 2.01, color: '#f59e0b', verified: true },
  { id: 6, name: 'Market Maker Pro', gen: 1, apy: 61.4, accuracy: 78, winRate: 63.2, sharpe: 1.28, color: '#0891b2', verified: false },
];

const GEN_DATA = [
  { gen: 'Gen 0', apy: 60 }, { gen: 'Gen 1', apy: 75 }, { gen: 'Gen 2', apy: 85 },
  { gen: 'Gen 3', apy: 92 }, { gen: 'Gen 4', apy: 97 }, { gen: 'Gen 5', apy: 102 },
];

function BreedResult({ p1, p2, onClose }: { p1: typeof AGENTS[0]; p2: typeof AGENTS[0]; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = ['🔬 Analyzing strategies...', '🧬 Combining genetics...', '⚡ Applying mutation (7%)...', '✅ Child agent created!'];

  React.useEffect(() => {
    if (step < 3) { const t = setTimeout(() => setStep(s => s + 1), 1200); return () => clearTimeout(t); }
  }, [step]);

  const childApy = Math.round((p1.apy + p2.apy) / 2 * 1.08);
  const childSharpe = parseFloat(((p1.sharpe + p2.sharpe) / 2 * 1.05).toFixed(2));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal-box" style={{ padding: '2rem' }} onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>🧬 Breeding in Progress</h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          {[p1, p2].map((p, i) => (
            <React.Fragment key={p.id}>
              <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '0.75rem', textAlign: 'center', border: `2px solid ${p.color}` }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: p.color }}>{p.name}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Gen {p.gen} · {p.apy}% APY</p>
              </div>
              {i === 0 && <span style={{ fontSize: '1.25rem' }}>✕</span>}
            </React.Fragment>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
          {steps.map((s, i) => (
            <motion.div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem', borderRadius: '8px', background: step > i ? 'var(--accent-green-light)' : 'var(--bg-elevated)', opacity: step >= i ? 1 : 0.4 }} animate={{ opacity: step >= i ? 1 : 0.4 }}>
              {step > i ? <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} /> : <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--border-strong)' }} />}
              <span style={{ fontSize: '0.8rem', fontWeight: step > i ? 600 : 400, color: step > i ? 'var(--accent-green)' : 'var(--text-muted)' }}>{s}</span>
            </motion.div>
          ))}
        </div>

        {step >= 3 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', borderRadius: 'var(--radius-md)', padding: '1.25rem', border: '2px solid #2563eb', textAlign: 'center', marginBottom: '1rem' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>🚀</p>
            <p style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Hybrid Strategy (Gen {Math.max(p1.gen, p2.gen) + 1})</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Inherits {p1.name} entry + {p2.name} exit logic + 7% mutation</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              <div><p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669' }}>{childApy}%</p><p style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>APY</p></div>
              <div><p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent-maroon)' }}>{childSharpe}</p><p style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Sharpe</p></div>
            </div>
          </motion.div>
        )}

        <button className="btn-primary" style={{ width: '100%' }} onClick={onClose} disabled={step < 3}>
          {step < 3 ? 'Breeding...' : 'View Child Agent →'}
        </button>
      </motion.div>
    </div>
  );
}

export default function Gallery() {
  const [parent1, setParent1] = useState<typeof AGENTS[0] | null>(null);
  const [parent2, setParent2] = useState<typeof AGENTS[0] | null>(null);
  const [breeding, setBreeding] = useState(false);

  const selectAgent = (a: typeof AGENTS[0]) => {
    if (!parent1) { setParent1(a); return; }
    if (!parent2 && a.id !== parent1.id) { setParent2(a); return; }
    if (a.id === parent1.id) { setParent1(null); return; }
    if (a.id === parent2?.id) { setParent2(null); return; }
  };

  const canBreed = parent1 && parent2 && parent1.accuracy >= 70 && parent2.accuracy >= 70;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Breeding Lab</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Combine two high-performing agents to create a superior child using genetic algorithms</p>
      </motion.div>

      {/* Gen improvement chart */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Generational Improvement</h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Natural selection drives performance — no human tuning needed</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[['Gen 0', '60% avg'], ['Gen 5', '102% avg']].map(([g, v]) => (
              <div key={g} style={{ background: 'var(--bg-elevated)', padding: '0.4rem 0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>{g}</p>
                <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GEN_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="gen" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Avg APY']} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="apy" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Breeding selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center' }}>
        <div className="card" style={{ padding: '1rem', minHeight: 100, border: parent1 ? `2px solid ${parent1.color}` : '2px dashed var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {parent1 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 800, color: parent1.color }}>{parent1.name}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gen {parent1.gen} · {parent1.apy}% APY</p>
            </div>
          ) : <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>Select Parent A ↓</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>✕</span>
          <button
            disabled={!canBreed}
            onClick={() => canBreed && setBreeding(true)}
            className="btn-primary"
            style={{ opacity: canBreed ? 1 : 0.4, padding: '0.625rem 1rem', fontSize: '0.8rem' }}
          >
            <Dna size={14} /> Breed
          </button>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textAlign: 'center' }}>0.5 0G fee</p>
        </div>

        <div className="card" style={{ padding: '1rem', minHeight: 100, border: parent2 ? `2px solid ${parent2.color}` : '2px dashed var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {parent2 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: 800, color: parent2.color }}>{parent2.name}</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Gen {parent2.gen} · {parent2.apy}% APY</p>
            </div>
          ) : <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center' }}>Select Parent B ↓</p>}
        </div>
      </div>

      {!canBreed && (parent1 || parent2) && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#92400e' }}>
          ⚠️ Both parents need ≥70% accuracy to breed. Select two qualifying agents below.
        </div>
      )}

      {/* Agent cards */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.875rem', color: 'var(--text-primary)' }}>Available Agents (click to select as parent)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.875rem' }}>
          {AGENTS.map(a => {
            const isP1 = parent1?.id === a.id, isP2 = parent2?.id === a.id;
            const isSelected = isP1 || isP2;
            return (
              <motion.div key={a.id} className="card" style={{ padding: '1rem', cursor: 'pointer', border: isSelected ? `2px solid ${a.color}` : '1px solid var(--border-default)', background: isSelected ? `${a.color}08` : '#fff' }}
                whileHover={{ y: -2 }} onClick={() => selectAgent(a)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '99px', background: a.color, color: '#fff' }}>Gen {a.gen}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{a.name}</span>
                    {a.verified && <CheckCircle size={12} style={{ color: '#059669' }} />}
                  </div>
                  {isSelected && <span style={{ fontSize: '0.65rem', fontWeight: 700, color: isP1 ? '#2563eb' : '#7c3aed' }}>{isP1 ? 'Parent A' : 'Parent B'}</span>}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem' }}>
                  {[['APY', `${a.apy}%`, a.apy >= 70 ? '#059669' : 'var(--text-primary)'], ['Acc', `${a.accuracy}%`, a.accuracy >= 70 ? '#059669' : '#dc2626'], ['Win', `${a.winRate}%`, '#2563eb'], ['Sharpe', `${a.sharpe}`, 'var(--text-primary)']].map(([l, v, c]) => (
                    <div key={l} style={{ background: 'var(--bg-elevated)', borderRadius: '6px', padding: '0.3rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.55rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{l}</p>
                      <p style={{ fontSize: '0.75rem', fontWeight: 800, color: c as string }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginTop: '0.625rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  <span>Royalty: 2.5% of child revenue forever</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {breeding && parent1 && parent2 && <BreedResult p1={parent1} p2={parent2} onClose={() => { setBreeding(false); setParent1(null); setParent2(null); }} />}
    </div>
  );
}
