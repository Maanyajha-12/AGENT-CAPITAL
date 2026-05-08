import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Target,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Zap,
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PorfolioSummary {
    totalInvested: number;
    currentValue: number;
    totalProfit: number;
    roi: number;
}

interface TopAgent {
    name: string;
    apy: number;
    winRate: number;
    profit: number;
}

const Dashboard: React.FC = () => {
    const [portfolio, setPortfolio] = useState<PorfolioSummary>({
        totalInvested: 25500,
        currentValue: 42300,
        totalProfit: 16800,
        roi: 65.9,
    });

    const [topAgents, setTopAgents] = useState<TopAgent[]>([
        { name: 'Alpha Fund #1001', apy: 145, winRate: 78, profit: 2850 },
        { name: 'Arbitrage Master #502', apy: 89, winRate: 82, profit: 1920 },
        { name: 'Yield Optimizer #304', apy: 67, winRate: 71, profit: 1450 },
    ]);

    const performanceData = [
        { date: 'Mon', value: 40000, invested: 25000 },
        { date: 'Tue', value: 41200, invested: 25000 },
        { date: 'Wed', value: 40800, invested: 25000 },
        { date: 'Thu', value: 42100, invested: 25500 },
        { date: 'Fri', value: 42300, invested: 25500 },
    ];

    const allocationData = [
        { name: 'Alpha Fund', value: 35 },
        { name: 'Arbitrage', value: 30 },
        { name: 'Yield', value: 25 },
        { name: 'Other', value: 10 },
    ];

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="min-h-screen bg-dark-bg-primary p-6 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
            >
                <h1 className="text-4xl font-bold text-dark-text-primary">
                    Dashboard <span className="gradient-text-primary">Capital</span>
                </h1>
                <p className="text-dark-text-secondary">Welcome back! Here's your portfolio performance</p>
            </motion.div>

            {/* Portfolio Summary Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="portfolio-summary"
            >
                {[
                    {
                        label: 'Total Invested',
                        value: `$${portfolio.totalInvested.toLocaleString()}`,
                        change: '-2.4%',
                        positive: false,
                        icon: Activity,
                    },
                    {
                        label: 'Current Value',
                        value: `$${portfolio.currentValue.toLocaleString()}`,
                        change: '+5.2%',
                        positive: true,
                        icon: TrendingUp,
                    },
                    {
                        label: 'Total Profit',
                        value: `$${portfolio.totalProfit.toLocaleString()}`,
                        change: `+${portfolio.roi.toFixed(1)}%`,
                        positive: true,
                        icon: Zap,
                    },
                    {
                        label: 'Monthly Return',
                        value: '$2,450',
                        change: '+12.1%',
                        positive: true,
                        icon: Target,
                    },
                ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="summary-card hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                    <p className="summary-label">{card.label}</p>
                                    <p className="summary-value">{card.value}</p>
                                    <div className={`metric-change ${card.positive ? 'positive' : 'negative'} text-xs mt-1`}>
                                        {card.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                        {card.change}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-dark-bg-tertiary/50">
                                    <Icon size={20} className="text-accent-primary" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts Row */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-lg"
            >
                {/* Performance Chart */}
                <motion.div className="lg:col-span-2 card p-2xl space-y-lg">
                    <h2 className="text-xl font-bold text-dark-text-primary">Portfolio Performance</h2>
                    <div className="chart-container!">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="date" stroke="#cbd5e1" />
                                <YAxis stroke="#cbd5e1" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1f3a',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={{ fill: '#3b82f6' }}
                                    name="Portfolio Value"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Allocation Chart */}
                <motion.div className="card p-2xl space-y-lg">
                    <h2 className="text-xl font-bold text-dark-text-primary">Allocation</h2>
                    <div className="chart-container! h-[300px]">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={allocationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {allocationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1f3a',
                                        border: '1px solid #334155',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </motion.div>

            {/* Top Agents & Recent Trades */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-lg"
            >
                {/* Top Agents */}
                <div className="card p-2xl space-y-lg">
                    <h2 className="text-xl font-bold text-dark-text-primary">Top Agents</h2>
                    <div className="space-y-md">
                        {topAgents.map((agent, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-md rounded-lg bg-dark-bg-tertiary/30 hover:bg-dark-bg-tertiary/50 transition-colors"
                            >
                                <div className="space-y-1">
                                    <p className="font-semibold text-dark-text-primary">{agent.name}</p>
                                    <p className="text-sm text-dark-text-tertiary">APY: {agent.apy}%</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="font-semibold text-accent-secondary">{agent.winRate}% Win</p>
                                    <p className="text-sm text-accent-secondary">+${agent.profit}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recent Trades */}
                <div className="card p-2xl space-y-lg">
                    <h2 className="text-xl font-bold text-dark-text-primary">Recent Trades</h2>
                    <div className="space-y-md">
                        {[
                            { action: 'BUY ETH', profit: 2450, time: '2h ago', status: 'success' },
                            { action: 'SELL LINK', profit: -320, time: '4h ago', status: 'loss' },
                            { action: 'BUY USDC', profit: 1850, time: '1d ago', status: 'success' },
                        ].map((trade, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center justify-between p-md rounded-lg bg-dark-bg-tertiary/30"
                            >
                                <div className="flex items-center gap-md">
                                    <div className={`w-2 h-2 rounded-full ${trade.status === 'success' ? 'bg-accent-secondary' : 'bg-accent-danger'}`} />
                                    <div>
                                        <p className="font-semibold text-dark-text-primary">{trade.action}</p>
                                        <p className="text-sm text-dark-text-tertiary">{trade.time}</p>
                                    </div>
                                </div>
                                <p className={`font-semibold ${trade.status === 'success' ? 'text-accent-secondary' : 'text-accent-danger'}`}>
                                    {trade.profit > 0 ? '+' : ''} ${Math.abs(trade.profit)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
