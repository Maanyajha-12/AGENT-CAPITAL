import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    BarChart3,
    Download,
    Share2,
    RefreshCw,
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface Holding {
    id: string;
    name: string;
    invested: number;
    currentValue: number;
    profit: number;
    roi: number;
    apy: number;
    riskLevel: string;
}

const PortfolioDashboard: React.FC = () => {
    const [timeframe, setTimeframe] = useState<'3m' | '6m' | '1y'>('3m');

    const portfolioMetrics = {
        totalInvested: 25500,
        currentValue: 42300,
        totalProfit: 16800,
        overallRoi: 65.9,
        portfolioVolatility: 12.3,
        maxDrawdown: 8.5,
        projectedMonthlyRevenue: 2450,
        projectedAnnualReturn: 29400,
        last7DaysProfit: 850,
        last30DaysProfit: 3200,
    };

    const holdings: Holding[] = [
        {
            id: '1',
            name: 'Alpha Fund #1001',
            invested: 10000,
            currentValue: 16450,
            profit: 6450,
            roi: 64.5,
            apy: 145,
            riskLevel: 'Balanced',
        },
        {
            id: '2',
            name: 'Arbitrage Master #502',
            invested: 8500,
            currentValue: 14200,
            profit: 5700,
            roi: 67.1,
            apy: 89,
            riskLevel: 'Aggressive',
        },
        {
            id: '3',
            name: 'Yield Optimizer #304',
            invested: 7000,
            currentValue: 11650,
            profit: 4650,
            roi: 66.4,
            apy: 67,
            riskLevel: 'Conservative',
        },
    ];

    const performanceData = [
        { date: 'Week 1', value: 30000, invested: 25000 },
        { date: 'Week 2', value: 35800, invested: 25000 },
        { date: 'Week 3', value: 39200, invested: 25300 },
        { date: 'Week 4', value: 42300, invested: 25500 },
    ];

    const allocationData = [
        { name: 'Alpha Fund', value: 39, color: '#3b82f6' },
        { name: 'Arbitrage', value: 34, color: '#10b981' },
        { name: 'Yield', value: 27, color: '#f59e0b' },
    ];

    const returnsDistribution = [
        { range: '+50-100%', trades: 12 },
        { range: '+25-50%', trades: 28 },
        { range: '+0-25%', trades: 45 },
        { range: '-0-25%', trades: 15 },
    ];

    const recommendations = [
        {
            action: 'SELL',
            agent: 'Beta Fund #602',
            reason: 'Performance declining - Sharpe ratio dropped',
            expectedROI: '+5%',
        },
        {
            action: 'BUY',
            agent: 'Gamma Fund #901',
            reason: 'Trending performer - 7-day return +45%',
            expectedROI: '+3-5% monthly',
        },
        {
            action: 'HEDGE',
            agent: 'Portfolio Rebalance',
            reason: 'Correlation too high (0.85) - diversify risk',
            expectedROI: '-2% but reduces volatility by 30%',
        },
    ];

    return (
        <div className="min-h-screen bg-dark-bg-primary p-6 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
            >
                <h1 className="text-4xl font-bold text-dark-text-primary">
                    Portfolio <span className="gradient-text-primary">Analytics</span>
                </h1>
                <p className="text-dark-text-secondary">Deep dive into your investment performance</p>
            </motion.div>

            {/* Summary Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg"
            >
                {[
                    {
                        label: 'Total Invested',
                        value: `$${portfolioMetrics.totalInvested.toLocaleString()}`,
                        change: '-2.4%',
                        positive: false,
                        icon: BarChart3,
                    },
                    {
                        label: 'Current Value',
                        value: `$${portfolioMetrics.currentValue.toLocaleString()}`,
                        change: '+65.9%',
                        positive: true,
                        icon: TrendingUp,
                    },
                    {
                        label: 'Portfolio Volatility',
                        value: `${portfolioMetrics.portfolioVolatility.toFixed(1)}%`,
                        change: '-1.2%',
                        positive: true,
                        icon: BarChart3,
                    },
                    {
                        label: 'Max Drawdown',
                        value: `${portfolioMetrics.maxDrawdown.toFixed(1)}%`,
                        change: '-0.5%',
                        positive: true,
                        icon: TrendingDown,
                    },
                ].map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="card p-lg space-y-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-dark-text-tertiary text-xs uppercase tracking-wider">{card.label}</p>
                                    <p className="text-2xl font-bold text-dark-text-primary">{card.value}</p>
                                </div>
                                <Icon className="text-accent-primary" size={24} />
                            </div>
                            <p className={`text-sm font-semibold ${card.positive ? 'text-accent-secondary' : 'text-accent-danger'}`}>
                                {card.change}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Charts Row 1 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-lg"
            >
                {/* Performance Chart */}
                <div className="lg:col-span-2 card p-2xl space-y-lg">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-dark-text-primary">Performance Trend</h2>
                        <div className="flex gap-sm">
                            {(['3m', '6m', '1y'] as const).map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-md py-sm rounded transition-all ${timeframe === tf
                                            ? 'bg-accent-primary text-white'
                                            : 'bg-dark-bg-tertiary/50 text-dark-text-secondary hover:bg-dark-bg-tertiary'
                                        }`}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </div>
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
                                    name="Portfolio Value"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="invested"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    name="Total Invested"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Allocation */}
                <div className="card p-2xl space-y-lg">
                    <h2 className="text-xl font-bold text-dark-text-primary">Allocation</h2>
                    <div className="chart-container! h-[300px]">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={allocationData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {allocationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                    <div className="space-y-sm">
                        {allocationData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-sm">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-dark-text-secondary">{item.name}</span>
                                </div>
                                <span className="font-semibold text-dark-text-primary">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Charts Row 2 */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-lg"
            >
                {/* Returns Distribution */}
                <div className="card p-2xl space-y-lg">
                    <h2 className="text-xl font-bold text-dark-text-primary">Returns Distribution</h2>
                    <div className="chart-container!">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={returnsDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="range" stroke="#cbd5e1" />
                                <YAxis stroke="#cbd5e1" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1f3a',
                                        border: '1px solid #334155',
                                    }}
                                />
                                <Bar dataKey="trades" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Risk Metrics */}
                <div className="card p-2xl space-y-lg">
                    <h2 className="text-xl font-bold text-dark-text-primary">Risk Metrics</h2>
                    <div className="space-y-lg">
                        {[
                            { label: 'Volatility', value: portfolioMetrics.portfolioVolatility, max: 30, color: '#f59e0b' },
                            { label: 'Max Drawdown', value: portfolioMetrics.maxDrawdown, max: 50, color: '#ef4444' },
                        ].map((metric, idx) => (
                            <div key={idx} className="space-y-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-dark-text-secondary">{metric.label}</p>
                                    <p className="font-bold text-dark-text-primary">{metric.value.toFixed(1)}%</p>
                                </div>
                                <div className="w-full h-2 rounded-full bg-dark-bg-tertiary/50 overflow-hidden">
                                    <div
                                        className="h-full transition-all"
                                        style={{
                                            width: `${(metric.value / metric.max) * 100}%`,
                                            backgroundColor: metric.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Holdings Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="card p-2xl space-y-lg"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-dark-text-primary">Your Holdings</h2>
                    <div className="flex gap-sm">
                        <button className="btn-primary bg-dark-bg-tertiary hover:bg-dark-bg-tertiary/80 text-dark-text-primary">
                            <Download size={16} />
                        </button>
                        <button className="btn-primary bg-dark-bg-tertiary hover:bg-dark-bg-tertiary/80 text-dark-text-primary">
                            <Share2 size={16} />
                        </button>
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Agent</th>
                                <th>Invested</th>
                                <th>Current Value</th>
                                <th>Profit</th>
                                <th>ROI</th>
                                <th>APY</th>
                                <th>Risk</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((holding) => (
                                <tr key={holding.id}>
                                    <td className="font-semibold">{holding.name}</td>
                                    <td>${holding.invested.toLocaleString()}</td>
                                    <td className="font-semibold">${holding.currentValue.toLocaleString()}</td>
                                    <td className="text-accent-secondary">+${holding.profit.toLocaleString()}</td>
                                    <td className="text-accent-secondary">{holding.roi.toFixed(1)}%</td>
                                    <td className="font-semibold">{holding.apy}%</td>
                                    <td>
                                        <span className="badge badge-primary">{holding.riskLevel}</span>
                                    </td>
                                    <td>
                                        <button className="text-accent-primary hover:text-accent-primary/80 font-semibold">
                                            Manage
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="card p-2xl space-y-lg"
            >
                <h2 className="text-xl font-bold text-dark-text-primary flex items-center gap-md">
                    <AlertTriangle size={20} className="text-accent-tertiary" />
                    Smart Recommendations
                </h2>
                <div className="space-y-md">
                    {recommendations.map((rec, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-lg rounded-lg bg-dark-bg-tertiary/30 border border-dark-border flex items-start justify-between gap-lg"
                        >
                            <div className="flex-1 space-y-sm">
                                <div className="flex items-center gap-md">
                                    <span className={`badge ${rec.action === 'SELL' ? 'badge-danger' : rec.action === 'BUY' ? 'badge-success' : 'badge-warning'}`}>
                                        {rec.action}
                                    </span>
                                    <span className="font-semibold text-dark-text-primary">{rec.agent}</span>
                                </div>
                                <p className="text-dark-text-secondary text-sm">{rec.reason}</p>
                            </div>
                            <div className="text-right space-y-sm">
                                <p className="text-accent-secondary font-semibold">{rec.expectedROI}</p>
                                <button className="btn-primary">Execute</button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default PortfolioDashboard;
