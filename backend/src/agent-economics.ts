// backend/src/agent-economics.ts - Agent Performance & Economics Tracking

import { OGStorage } from "./og-storage";

export interface AgentMetrics {
    agentId: number;
    strategyType: string;
    generation: number;
    totalCapital: number;
    totalRevenue: number;
    accuracy: number;
    winRate: number;
    tradeCount: number;
    avereageTradeProfit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    apy: number;
    lastTradeTime: number;
}

export interface Trade {
    tradeId: number;
    agentId: number;
    action: string;
    amount: number;
    profit: number;
    proofHash: string;
    timestamp: number;
    executed: boolean;
}

export class AgentEconomicsTracker {
    private storage: OGStorage;

    constructor(storage: OGStorage) {
        this.storage = storage;
    }

    /**
     * Record a trade execution with profit
     */
    async recordTrade(trade: Trade): Promise<void> {
        // Store trade in KV
        const tradeKey = `trade:${trade.agentId}:${trade.tradeId}`;
        await this.storage.setKV(tradeKey, JSON.stringify(trade));

        // Add to trades list
        const listKey = `trades:${trade.agentId}`;
        const existingTrades = JSON.parse(
            (await this.storage.getKV(listKey)) || "[]"
        );
        existingTrades.push(trade.tradeId);
        await this.storage.setKV(listKey, JSON.stringify(existingTrades));

        // Log to audit trail
        await this.storage.logEvent(
            `trade:${trade.agentId}:${trade.tradeId}`,
            JSON.stringify(trade),
            "trade_executed"
        );
    }

    /**
     * Get agent trade history
     */
    async getAgentTradeHistory(agentId: number, limit: number = 100): Promise<Trade[]> {
        try {
            const listKey = `trades:${agentId}`;
            const tradeIds = JSON.parse(
                (await this.storage.getKV(listKey)) || "[]"
            );

            const trades: Trade[] = [];
            for (let i = Math.max(0, tradeIds.length - limit); i < tradeIds.length; i++) {
                const tradeId = tradeIds[i];
                const tradeKey = `trade:${agentId}:${tradeId}`;
                const tradeData = await this.storage.getKV(tradeKey);
                if (tradeData) {
                    trades.push(JSON.parse(tradeData));
                }
            }

            return trades;
        } catch (error) {
            console.error("Error fetching trade history:", error);
            return [];
        }
    }

    /**
     * Calculate agent metrics from trade history
     */
    async calculateAgentMetrics(agentId: number): Promise<AgentMetrics> {
        const trades = await this.getAgentTradeHistory(agentId, 1000);

        let totalProfit = 0;
        let winCount = 0;
        let maxDrawdown = 0;
        let runningBalance = 0;
        let peakBalance = 0;

        for (const trade of trades) {
            totalProfit += trade.profit;
            if (trade.profit > 0) winCount++;

            runningBalance += trade.profit;
            if (runningBalance > peakBalance) {
                peakBalance = runningBalance;
            }

            const drawdown = peakBalance - runningBalance;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }

        const winRate = trades.length > 0 ? (winCount / trades.length) * 100 : 0;
        const avgProfit = trades.length > 0 ? totalProfit / trades.length : 0;
        const accuracy = winRate;

        // Simplified Sharpe Ratio (0.5 * avg_return / daily_volatility)
        const sharpeRatio = avgProfit > 0 ? avgProfit / Math.max(1, maxDrawdown / 10) : 0;

        // APY: assume 250 trading days per year
        const apy = avgProfit * 250 > 0 ? ((avgProfit * 250) / 100) * 100 : 0;

        return {
            agentId,
            strategyType: "auto",
            generation: 0,
            totalCapital: 100000, // Default
            totalRevenue: totalProfit,
            accuracy: Math.min(100, accuracy),
            winRate,
            tradeCount: trades.length,
            avereageTradeProfit: avgProfit,
            maxDrawdown,
            sharpeRatio,
            apy,
            lastTradeTime: trades.length > 0 ? trades[trades.length - 1].timestamp : 0,
        };
    }

    /**
     * Get platform-wide economics
     */
    async getPlatformEconomics(): Promise<any> {
        try {
            // Get all agents (in production, fetch from AgentCapital contract)
            const agentCountKey = "platform:agent_count";
            const agentCount = parseInt(
                (await this.storage.getKV(agentCountKey)) || "0"
            );

            let totalTVL = 0;
            let totalRevenue = 0;
            let totalTrades = 0;
            const metricsArray: AgentMetrics[] = [];

            for (let i = 1; i <= agentCount; i++) {
                const metrics = await this.calculateAgentMetrics(i);
                metricsArray.push(metrics);
                totalTVL += metrics.totalCapital;
                totalRevenue += metrics.totalRevenue;
                totalTrades += metrics.tradeCount;
            }

            const avgAPY = metricsArray.length > 0
                ? metricsArray.reduce((sum, m) => sum + m.apy, 0) / metricsArray.length
                : 0;

            return {
                totalAgents: agentCount,
                totalTVL,
                totalRevenue,
                totalTrades,
                averageAPY: avgAPY,
                topPerformers: metricsArray
                    .sort((a, b) => b.apy - a.apy)
                    .slice(0, 5),
                platformFeeGenerated: (totalRevenue * 10) / 100, // 10% platform fee
                timestamp: Date.now(),
            };
        } catch (error) {
            console.error("Error calculating platform economics:", error);
            return null;
        }
    }

    /**
     * Get agent breeding history
     */
    async getBreedingHistory(agentId: number): Promise<any[]> {
        try {
            const breedingKey = `breeding:${agentId}`;
            const data = await this.storage.getKV(breedingKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error fetching breeding history:", error);
            return [];
        }
    }

    /**
     * Record breeding event
     */
    async recordBreeding(parent1: number, parent2: number, childId: number): Promise<void> {
        const breedingEvent = {
            parent1,
            parent2,
            childId,
            timestamp: Date.now(),
        };

        // Log to parent 1
        const key1 = `breeding:${parent1}`;
        const history1 = JSON.parse((await this.storage.getKV(key1)) || "[]");
        history1.push(breedingEvent);
        await this.storage.setKV(key1, JSON.stringify(history1));

        // Log to parent 2
        const key2 = `breeding:${parent2}`;
        const history2 = JSON.parse((await this.storage.getKV(key2)) || "[]");
        history2.push(breedingEvent);
        await this.storage.setKV(key2, JSON.stringify(history2));

        // Log to audit trail
        await this.storage.logEvent(
            `breeding:${parent1}:${parent2}:${childId}`,
            JSON.stringify(breedingEvent),
            "agent_bred"
        );
    }

    /**
     * Calculate parent royalty payments
     */
    async calculateParentRoyalties(childAgentId: number, childRevenue: number): Promise<Map<number, number>> {
        const breedingHistory = await this.getBreedingHistory(childAgentId);
        const royalties = new Map<number, number>();

        // Standard: 2.5% per parent
        const parentRoyaltyRate = 0.025;

        for (const event of breedingHistory) {
            if (event.childId === childAgentId) {
                royalties.set(event.parent1, childRevenue * parentRoyaltyRate);
                royalties.set(event.parent2, childRevenue * parentRoyaltyRate);
                break;
            }
        }

        return royalties;
    }

    /**
     * Get leaderboard by APY
     */
    async getLeaderboard(limit: number = 10): Promise<AgentMetrics[]> {
        try {
            // In production, query all agents
            const agentCountKey = "platform:agent_count";
            const agentCount = parseInt(
                (await this.storage.getKV(agentCountKey)) || "0"
            );

            const metricsArray: AgentMetrics[] = [];

            for (let i = 1; i <= agentCount; i++) {
                const metrics = await this.calculateAgentMetrics(i);
                metricsArray.push(metrics);
            }

            return metricsArray
                .sort((a, b) => b.apy - a.apy)
                .slice(0, limit);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            return [];
        }
    }
}
