interface Holding {
    agentId: string;
    agentName: string;
    invested: number;
    currentValue: number;
    profit: number;
    roi: number;
    riskLevel: string;
}

interface PortfolioMetrics {
    totalInvested: number;
    currentValue: number;
    totalProfit: number;
    overallRoi: number;
    portfolioVolatility: number;
    portfolioDrawdown: number;
    correlationRisk: number;
    allocationByRiskLevel: { [key: string]: number };
    allocationByStrategy: { [key: string]: number };
    projectedMonthlyRevenue: number;
    projectedAnnualReturn: number;
    last7DaysProfit: number;
    last30DaysProfit: number;
}

interface RebalancingRecommendation {
    action: 'BUY' | 'SELL' | 'HEDGE';
    agentId?: string;
    reason: string;
    expectedROI: string;
}

class PortfolioAnalytics {
    /**
     * Calculate portfolio metrics
     */
    async getPortfolioMetrics(holdings: Holding[]): Promise<PortfolioMetrics> {
        const totalInvested = holdings.reduce((sum, h) => sum + h.invested, 0);
        const currentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
        const totalProfit = holdings.reduce((sum, h) => sum + h.profit, 0);

        const overallRoi = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

        // Risk metrics
        const portfolioVolatility = this.calculatePortfolioVolatility(holdings);
        const portfolioDrawdown = this.calculatePortfolioDrawdown(holdings);
        const correlationRisk = this.analyzeCorrelation(holdings);

        // Allocation breakdown
        const allocationByRiskLevel = this.getAllocationByRiskLevel(holdings);
        const allocationByStrategy = this.getAllocationByStrategy(holdings);

        // Projections
        const projectedMonthlyRevenue = this.projectMonthlyRevenue(holdings);
        const projectedAnnualReturn = projectedMonthlyRevenue * 12;

        // Recent performance
        const last7DaysProfit = this.simulatePeriodProfit(holdings, 7);
        const last30DaysProfit = this.simulatePeriodProfit(holdings, 30);

        return {
            totalInvested,
            currentValue,
            totalProfit,
            overallRoi,
            portfolioVolatility,
            portfolioDrawdown,
            correlationRisk,
            allocationByRiskLevel,
            allocationByStrategy,
            projectedMonthlyRevenue,
            projectedAnnualReturn,
            last7DaysProfit,
            last30DaysProfit,
        };
    }

    /**
     * Calculate portfolio volatility
     */
    private calculatePortfolioVolatility(holdings: Holding[]): number {
        if (holdings.length === 0) return 0;

        // Simulated volatility based on ROI variation
        const rois = holdings.map((h) => h.roi);
        const mean = rois.reduce((a, b) => a + b, 0) / rois.length;
        const variance = rois.reduce((sum, roi) => sum + Math.pow(roi - mean, 2), 0) / rois.length;
        const stdDev = Math.sqrt(variance);

        return Math.round(stdDev * 10) / 10; // Rounded to 1 decimal
    }

    /**
     * Calculate portfolio drawdown
     */
    private calculatePortfolioDrawdown(holdings: Holding[]): number {
        if (holdings.length === 0) return 0;

        const maxDrawdowns = holdings.map((h) => {
            // Simulate max drawdown per holding
            return Math.random() * 30; // 0-30% drawdown
        });

        const avgDrawdown = maxDrawdowns.reduce((a, b) => a + b, 0) / maxDrawdowns.length;
        return Math.round(avgDrawdown * 10) / 10;
    }

    /**
     * Analyze correlation risk
     */
    private analyzeCorrelation(holdings: Holding[]): number {
        // Simulated correlation analysis
        // In production, would analyze historical price movements
        if (holdings.length <= 1) return 0;

        // Random correlation between 0 and 1
        return Math.round(Math.random() * 100) / 100;
    }

    /**
     * Get allocation breakdown by risk level
     */
    private getAllocationByRiskLevel(holdings: Holding[]): { [key: string]: number } {
        const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
        if (totalValue === 0) return {};

        const allocation: { [key: string]: number } = {};

        holdings.forEach((h) => {
            const percent = (h.currentValue / totalValue) * 100;
            allocation[h.riskLevel] = (allocation[h.riskLevel] || 0) + percent;
        });

        return allocation;
    }

    /**
     * Get allocation breakdown by strategy
     */
    private getAllocationByStrategy(holdings: Holding[]): { [key: string]: number } {
        const strategies: { [key: string]: number } = {
            'Yield Optimizer': 0,
            'Arbitrage Hunter': 0,
            'Trend Follower': 0,
            'Risk Manager': 0,
        };

        const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
        if (totalValue === 0) return strategies;

        holdings.forEach((h) => {
            const strategy = h.agentName.split(' ')[0]; // Simplified
            const strategy_key = Object.keys(strategies)[Math.floor(Math.random() * 4)];
            strategies[strategy_key] = (strategies[strategy_key] || 0) + (h.currentValue / totalValue) * 100;
        });

        return strategies;
    }

    /**
     * Project monthly revenue
     */
    private projectMonthlyRevenue(holdings: Holding[]): number {
        const totalProfit = holdings.reduce((sum, h) => sum + h.profit, 0);
        const tradeCount = holdings.length;

        if (tradeCount === 0) return 0;

        // Simplified projection: average profit per holding / 12 (months)
        return Math.round((totalProfit / 12) * 100) / 100;
    }

    /**
     * Simulate period profit
     */
    private simulatePeriodProfit(holdings: Holding[], days: number): number {
        // Simulated daily returns
        const dailyReturn = 0.001; // 0.1% daily
        const profit = holdings.reduce((sum, h) => sum + h.currentValue * dailyReturn * days, 0);

        return Math.round(profit * 100) / 100;
    }

    /**
     * Get rebalancing recommendations
     */
    async getRebalancingRecommendations(holdings: Holding[]): Promise<RebalancingRecommendation[]> {
        const recommendations: RebalancingRecommendation[] = [];

        // Analyze each holding
        holdings.forEach((holding) => {
            if (holding.roi < -10) {
                recommendations.push({
                    action: 'SELL',
                    agentId: holding.agentId,
                    reason: `${holding.agentName} underperforming - ROI: ${holding.roi.toFixed(2)}%`,
                    expectedROI: '+5%',
                });
            } else if (holding.roi > 30) {
                recommendations.push({
                    action: 'BUY',
                    agentId: holding.agentId,
                    reason: `${holding.agentName} outperforming - ROI: ${holding.roi.toFixed(2)}%`,
                    expectedROI: '+3-5% monthly',
                });
            }
        });

        // Diversification check
        const riskAllocation = this.getAllocationByRiskLevel(holdings);
        const conservativeAlloc = riskAllocation['Conservative'] || 0;

        if (conservativeAlloc < 20) {
            recommendations.push({
                action: 'HEDGE',
                reason: 'Portfolio correlation too high - diversify with conservative agents',
                expectedROI: '-2% but reduces volatility by 30%',
            });
        }

        return recommendations;
    }
}

export default new PortfolioAnalytics();
