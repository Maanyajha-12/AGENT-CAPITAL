import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Trophy, Flame, Star, CheckCircle, Award, TrendingUp, Users } from 'lucide-react';

const AGENTS = [
  { id: 1, name: 'Yield Harvester+', totalTrades: 1247, winRate: 71.3, streak: 47, profitFactor: 2.8, sharpe: 1.94, years: 2.3, volume: 48.2, blowups: 0, score: 94, color: 'var(--accent-maroon)', badges: ['profitable_year', 'trending', 'institutional', 'risk_master'] },
  { id: 2, name: 'Volatility Surge', totalTrades: 892,  winRate: 68.5, streak: 12, profitFactor: 2.1, sharpe: 1.67, years: 1.8, volume: 31.4, blowups: 0, score: 82, color: '#7c3aed', badges: ['profitable_year', 'trending', 'institutional'] },
  { id: 3, name: 'Arbitrage Master', totalTrades: 567,  winRate: 74.2, streak: 28, profitFactor: 3.1, sharpe: 1.52, years: 1.2, volume: 22.8, blowups: 0, score: 79, color: '#d97706', badges: ['risk_master', 'institutional'] },
  { id: 4, name: 'Stablecoin Pro',   totalTrades: 2341, winRate: 89.1, streak: 103,profitFactor: 4.2, sharpe: 1.34, years: 3.1, volume: 78.4, blowups: 0, score: 91, color: '#059669', badges: ['profitable_year', 'risk_master', 'institutional'] },
  { id: 5, name: 'Epsilon Core',     totalTrades: 456,  winRate: 78.4, streak: 21, profitFactor: 2.6, sharpe: 2.01, years: 0.8, volume: 18.2, blowups: 0, score: 88, color: '#f59e0b', badges: ['trending', 'institutional', 'explosive'] },
  { id: 6, name: 'Market Maker Pro', totalTrades: 345,  winRate: 63.2, streak: 5,  profitFactor: 1.8, sharpe: 1.28, years: 0.5, volume: 12.1, blowups: 0, score: 64, color: '#0891b2', badges: [] },
];

const BADGE_META: Record<string, { label: string; emoji: string; desc: string; color: string; bg: string }> = {
  profitable_year:  { label: 'Profitable Year',   emoji: '🏆', desc: 'Positive returns for 12+ consecutive months', color: '#d97706', bg: '#fffbeb' },
  trending:         { label: 'Trending',           emoji: '🔥', desc: 'Top 5% performer this month',               color: '#dc2626', bg: '#fef2f2' },
  institutional:    { label: 'Institutional-Grade', emoji: '💎', desc: 'Sharpe Ratio > 1.5',                        color: 'var(--accent-maroon)', bg: '#eff6ff' },
  risk_master:      { label: 'Risk Master',        emoji: '🛡️', desc: 'Max drawdown < 10%',                        color: '#059669', bg: '#ecfdf5' },
  explosive:        { label: 'Explosive Growth',   emoji: '🚀', desc: '>100% APY achieved honestly',               color: '#7c3aed', bg: '#f5f3ff' },
};

const LEADERBOARD = [...AGENTS].sort((a, b) => b.score - a.score);

export default function ArenaPanel() {
  const [selected, setSelected] = useState(AGENTS[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display" style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Agent Reputation</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>On-chain verified reputation scores and achievement badges — powered by 0G Compute</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
        {/* Leaderboard */}
        <div className="card" style={{ padding: '1.25rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Trophy size={18} style={{ color: '#d97706' }} />
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Reputation Ranking</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {LEADERBOARD.map((a, i) => (
              <motion.div key={a.id} onClick={() => setSelected(a)}
                style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: `1px solid ${selected.id === a.id ? a.color : 'var(--border-default)'}`, background: selected.id === a.id ? `${a.color}08` : 'var(--bg-elevated)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}
                whileHover={{ x: 2 }}
              >
                <span style={{ fontSize: i < 3 ? '1rem' : '0.8rem', fontWeight: 700, color: 'var(--text-dim)', width: 20, textAlign: 'center' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.name}</p>
                  <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.2rem' }}>
                    {a.badges.slice(0, 3).map(b => <span key={b} style={{ fontSize: '0.7rem' }}>{BADGE_META[b]?.emoji}</span>)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: a.color, fontFamily: 'Outfit, sans-serif' }}>{a.score}</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>score</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected agent detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Header */}
          <motion.div key={selected.id} className="card" style={{ padding: '1.25rem', borderTop: `3px solid ${selected.color}` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selected.name}</h2>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>On-chain verified · 0G Compute reputation proof</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: selected.color }}>{selected.score}</div>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rep Score</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
              {[
                { label: 'Total Trades', val: selected.totalTrades.toLocaleString() },
                { label: 'Win Rate', val: `${selected.winRate}%` },
                { label: 'Win Streak', val: `${selected.streak}` },
                { label: 'Profit Factor', val: `${selected.profitFactor}x` },
                { label: 'Sharpe Ratio', val: selected.sharpe.toFixed(2) },
                { label: 'Years Active', val: `${selected.years}y` },
                { label: 'Volume Traded', val: `$${selected.volume}M` },
                { label: 'Blowups', val: `${selected.blowups}` },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: 'var(--bg-elevated)', borderRadius: '8px', padding: '0.625rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.6rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>{label}</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{val}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Badges */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Award size={16} style={{ color: '#d97706' }} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Achievement Badges (ERC-721)</h3>
            </div>
            {selected.badges.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>No badges earned yet — keep trading!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {selected.badges.map(b => {
                  const meta = BADGE_META[b];
                  return (
                    <motion.div key={b} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.02 }}
                      style={{ padding: '0.875rem', borderRadius: 'var(--radius-md)', background: meta.bg, border: `1px solid ${meta.color}30`, display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{meta.emoji}</span>
                      <div>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: meta.color }}>{meta.label}</p>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{meta.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Locked badges */}
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginTop: '1rem', marginBottom: '0.5rem' }}>Locked Badges</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.entries(BADGE_META).filter(([k]) => !selected.badges.includes(k)).map(([k, meta]) => (
                <div key={k} style={{ padding: '0.3rem 0.625rem', borderRadius: '99px', background: 'var(--bg-elevated)', border: '1px dashed var(--border-strong)', display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: 0.5 }}>
                  <span style={{ fontSize: '0.8rem' }}>{meta.emoji}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{meta.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
