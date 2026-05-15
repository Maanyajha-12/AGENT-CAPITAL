import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Heart, ArrowUpRight, Zap, Shield } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface AgentCardProps {
    id: string;
    name: string;
    strategy: string;
    generation: number;
    rating: number;
    reviews: number;
    winRate: number;
    apy: number;
    apySource?: string | null;
    apySourceLink?: string | null;
    apyLastUpdated?: number | null;
    sharpeRatio: number;
    maxDrawdown: number;
    creator: string;
    holders: number;
    aum: string;
    riskLevel: 'Conservative' | 'Balanced' | 'Aggressive' | 'HighRisk';
    lastTrade: string;
    nextRebalance: string;
    trending?: boolean;
    sparklineData?: Array<{ date: string; value: number }>;
    onInvest?: () => void;
    onFollow?: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({
    id,
    name,
    strategy,
    generation,
    rating,
    reviews,
    winRate,
    apy,
    apySource,
    apySourceLink,
    apyLastUpdated,
    sharpeRatio,
    maxDrawdown,
    creator,
    holders,
    aum,
    riskLevel,
    lastTrade,
    nextRebalance,
    trending = false,
    sparklineData = [],
    onInvest,
    onFollow,
}) => {
    const timeAgo = (ts?: number | null) => {
        if (!ts) return 'Unknown';
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return `${s}s ago`;
        const m = Math.floor(s / 60);
        if (m < 60) return `${m}m ago`;
        const h = Math.floor(m / 60);
        return `${h}h ago`;
    };
    const getRiskColor = (level: string) => {
        switch (level) {
            case 'Conservative':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'Balanced':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'Aggressive':
                return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'HighRisk':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-dark-border/20 text-dark-text-tertiary border-dark-border';
        }
    };

    const getRiskScore = (level: string) => {
        switch (level) {
            case 'Conservative':
                return 2;
            case 'Balanced':
                return 5;
            case 'Aggressive':
                return 8;
            case 'HighRisk':
                return 10;
            default:
                return 5;
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="agent-card"
        >
            {/* Header Section */}
            <div className="agent-header">
                <div className="space-y-sm flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="agent-name">{name}</h3>
                            <p className="text-dark-text-secondary text-sm">{strategy}</p>
                        </div>
                        <div className="badge-primary">Gen {generation}</div>
                    </div>
                    <div className="flex items-center gap-xs">
                        <div className="flex items-center gap-xs">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={14}
                                    className={i < Math.round(rating) ? 'fill-accent-tertiary text-accent-tertiary' : 'text-dark-border'}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-dark-text-tertiary">({reviews} reviews)</span>
                    </div>
                </div>
                {trending && (
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-accent-tertiary text-xl"
                    >
                        🔥
                    </motion.div>
                )}
            </div>

            {/* Performance Chart */}
            {sparklineData.length > 0 && (
                <div className="h-16 -mx-lg -mt-md">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Metrics Grid (4 columns) */}
            <div className="agent-metrics">
                <div className="agent-metric-item">
                    <p className="text-dark-text-tertiary text-xs uppercase tracking-wider">Win Rate</p>
                    <p className="metric-value text-accent-secondary">{winRate}%</p>
                </div>
                <div className="agent-metric-item">
                    <p className="text-dark-text-tertiary text-xs uppercase tracking-wider">APY</p>
                    <p className="metric-value text-accent-secondary">{apy ?? '—'}%</p>
                    {apySource && (
                        <div style={{ marginTop: 6 }}>
                            <p className="text-xs text-dark-text-tertiary">Source: {apySource}</p>
                            {apySourceLink && (
                                <a href={apySourceLink} target="_blank" rel="noopener noreferrer" className="text-xs text-accent-secondary" style={{ textDecoration: 'underline' }}>
                                    Verify on source →
                                </a>
                            )}
                            {apyLastUpdated && (
                                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>Updated {timeAgo(apyLastUpdated)}</div>
                            )}
                        </div>
                    )}
                </div>
                <div className="agent-metric-item">
                    <p className="text-dark-text-tertiary text-xs uppercase tracking-wider">Sharpe</p>
                    <p className="metric-value">{sharpeRatio.toFixed(2)}</p>
                </div>
                <div className="agent-metric-item">
                    <p className="text-dark-text-tertiary text-xs uppercase tracking-wider">Drawdown</p>
                    <p className={`metric-value ${maxDrawdown > 20 ? 'text-accent-danger' : maxDrawdown > 10 ? 'text-accent-tertiary' : 'text-accent-secondary'}`}>
                        {maxDrawdown.toFixed(1)}%
                    </p>
                </div>
            </div>

            {/* Portfolio Composition */}
            <div className="space-y-sm">
                <p className="text-dark-text-tertiary text-xs uppercase tracking-wider">Portfolio</p>
                <div className="flex items-center gap-sm h-6">
                    {[
                        { label: 'ETH', percent: 60, color: 'bg-blue-500' },
                        { label: 'USDC', percent: 30, color: 'bg-green-500' },
                        { label: 'LINK', percent: 10, color: 'bg-purple-500' },
                    ].map((asset, idx) => (
                        <div
                            key={idx}
                            style={{ width: `${asset.percent}%` }}
                            className={`h-full rounded ${asset.color}/80 hover:${asset.color} transition-all cursor-help`}
                            title={`${asset.label}: ${asset.percent}%`}
                        />
                    ))}
                </div>
                <p className="text-xs text-dark-text-tertiary">60% ETH, 30% USDC, 10% LINK</p>
            </div>

            {/* Owner Info */}
            <div className="grid grid-cols-3 gap-sm text-center py-md bg-dark-bg-tertiary/30 rounded-lg px-md">
                <div className="space-y-xs">
                    <p className="text-xs text-dark-text-tertiary">Creator</p>
                    <p className="text-sm font-semibold text-dark-text-primary">{creator}</p>
                </div>
                <div className="space-y-xs border-l border-r border-dark-border">
                    <p className="text-xs text-dark-text-tertiary">Holders</p>
                    <p className="text-sm font-semibold text-dark-text-primary">{holders}</p>
                </div>
                <div className="space-y-xs">
                    <p className="text-xs text-dark-text-tertiary">AUM</p>
                    <p className="text-sm font-semibold text-dark-text-primary">{aum}</p>
                </div>
            </div>

            {/* Risk Indicator */}
            <div className="space-y-sm">
                <p className="text-dark-text-tertiary text-xs uppercase tracking-wider">Risk Profile</p>
                <div className="flex items-center justify-between">
                    <span className={`badge border ${getRiskColor(riskLevel)}`}>{riskLevel}</span>
                    <div className="flex gap-xs">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 h-4 rounded-full transition-all ${i < getRiskScore(riskLevel) ? 'bg-accent-danger' : 'bg-dark-border/50'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Status Info */}
            <div className="grid grid-cols-2 gap-sm text-xs text-dark-text-secondary">
                <div>Last Trade: {lastTrade}</div>
                <div className="text-right">Next Rebalance: {nextRebalance}</div>
            </div>

            {/* Action Buttons */}
            <div className="agent-actions">
                <button
                    onClick={onInvest}
                    className="btn-glass flex-1"
                >
                    <Zap size={16} />
                    Invest Now
                </button>
                <button
                    onClick={onFollow}
                    className="btn-primary flex-1 bg-dark-bg-tertiary hover:bg-dark-bg-tertiary/80"
                >
                    <Heart size={16} />
                    Follow
                </button>
            </div>
        </motion.div>
    );
};

export default AgentCard;
