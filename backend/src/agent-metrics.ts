interface TradeData {
    profit: number;
    confidence: number;
    timestamp: number;
}

interface AgentMetrics {
    winRate: number;
    totalProfit: number;
    accuracy: number;
    sharpeRatio: number;
    maxDrawdown: number;
    apy: number;
    tradeCount: number;
    lastTradeAt: number;
}

class AgentMetricsService {
    private agentMetricsCache = new Map<string, AgentMetrics>();

    /**
     * Calculate real metrics for an agent
     */
    async calculateRealMetrics(agentId: string, trades: TradeData[], capital: number): Promise<AgentMetrics> {
        if (trades.length === 0) {
            return {
                winRate: 0,
                totalProfit: 0,
                accuracy: 0,
                sharpeRatio: 0,
                maxDrawdown: 0,
                apy: 0,
                tradeCount: 0,
                lastTradeAt: 0,
            };
        }

        // Win rate
        const winningTrades = trades.filter((t) => t.profit > 0);
        const winRate = (winningTrades.length / trades.length) * 100;

        // Total profit
        const totalProfit = trades.reduce((sum, t) => sum + t.profit, 0);

        // Accuracy (average confidence)
        const accuracy = trades.reduce((sum, t) => sum + t.confidence, 0) / trades.length;

        // Sharpe Ratio
        const sharpeRatio = this.calculateSharpe(trades);

        // Max Drawdown
        const maxDrawdown = this.calculateDrawdown(trades);

        // APY
        const apy = this.calculateAPY(totalProfit, capital, trades[0].timestamp, trades[trades.length - 1].timestamp);

        const metrics: AgentMetrics = {
            winRate,
            totalProfit,
            accuracy,
            sharpeRatio,
            maxDrawdown,
            apy,
            tradeCount: trades.length,
            lastTradeAt: trades[trades.length - 1].timestamp,
        };

        this.agentMetricsCache.set(agentId, metrics);
        return metrics;
    }

    /**
     * Calculate Sharpe Ratio
     * Sharpe = (return - risk_free_rate) / standard_deviation
     */
    private calculateSharpe(trades: TradeData[]): number {
        const profits = trades.map((t) => t.profit);
        const mean = profits.reduce((a, b) => a + b, 0) / profits.length;
        const variance = profits.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / profits.length;
        const stdDev = Math.sqrt(variance);

        if (stdDev === 0) return 0;

        const riskFreeRate = 0.15; // 15% annual (crypto staking)
        const sharpe = ((mean - riskFreeRate) / stdDev) * Math.sqrt(252); // Annualized

        return Math.max(0, sharpe);
    }

    /**
     * Calculate maximum drawdown
     */
    private calculateDrawdown(trades: TradeData[]): number {
        let peak = 0;
        let maxDD = 0;
        let cumProfit = 0;

        for (const trade of trades) {
            cumProfit += trade.profit;
            if (cumProfit > peak) peak = cumProfit;
            const dd = peak > 0 ? ((peak - cumProfit) / peak) * 100 : 0;
            if (dd > maxDD) maxDD = dd;
        }

        return maxDD;
    }

    /**
     * Calculate annualized percentage yield
     */
    private calculateAPY(totalProfit: number, capital: number, startTime: number, endTime: number): number {
        if (capital === 0) return 0;

        const daysActive = (endTime - startTime) / (1000 * 60 * 60 * 24);
        if (daysActive === 0) return 0;

        const dailyReturn = totalProfit / capital / daysActive;
        const annualizedReturn = (1 + dailyReturn) ** 365 - 1;

        return Math.max(0, annualizedReturn * 100);
    }

    /**
     * Get metrics from cache
     */
    getMetrics(agentId: string): AgentMetrics | undefined {
        return this.agentMetricsCache.get(agentId);
    }

    /**
     * Clear cache (useful for testing)
     */
    clearCache(): void {
        this.agentMetricsCache.clear();
    }
}

export default new AgentMetricsService();
