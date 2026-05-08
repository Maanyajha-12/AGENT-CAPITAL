interface Agent {
    id: string;
    name: string;
    creator: string;
    metrics: {
        winRate: number;
        sharpeRatio: number;
        maxDrawdown: number;
        totalProfit: number;
        apy: number;
        accuracy: number;
    };
    tradeCount: number;
    lastTradeAt: number;
}

interface RankedAgent extends Agent {
    score: number;
    category: string;
    rank: number;
}

class AgentRankingService {
    /**
     * Calculate agent score using weighted factors
     */
    calculateAgentScore(metrics: any): number {
        // Weighted scoring system
        const scores = {
            winRate: (metrics.winRate / 100) * 0.25, // 25% weight, normalized 0-1
            sharpeRatio: Math.min(metrics.sharpeRatio / 5, 1) * 0.25, // 25% weight (capped at 5)
            consistency: ((100 - Math.min(metrics.maxDrawdown, 100)) / 100) * 0.25, // 25% weight
            profitability: Math.min((metrics.apy / 100) / 5, 1) * 0.25, // 25% weight (capped at 500% APY)
        };

        const totalScore = Object.values(scores).reduce((a: number, b: any) => a + b, 0);
        return Math.round(totalScore * 100); // Normalized to 0-100
    }

    /**
     * Get top agents ranked by score
     */
    async getTopAgents(agents: Agent[], limit: number = 10): Promise<RankedAgent[]> {
        const rankedAgents: RankedAgent[] = agents
            .map((agent, index) => ({
                ...agent,
                score: this.calculateAgentScore(agent.metrics),
                category: this.categorizeAgent(agent.metrics),
                rank: index + 1,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map((agent, index) => ({
                ...agent,
                rank: index + 1,
            }));

        return rankedAgents;
    }

    /**
     * Categorize agent by risk profile
     */
    private categorizeAgent(metrics: any): string {
        const drawdown = metrics.maxDrawdown;

        if (drawdown < 5) return 'Conservative';
        if (drawdown < 15) return 'Balanced';
        if (drawdown < 30) return 'Aggressive';
        return 'HighRisk';
    }

    /**
     * Get trending agents (biggest improvement over timeframe)
     */
    async getTrendingAgents(agents: Agent[], timeframe: 'day' | 'week' | 'month' = 'week'): Promise<RankedAgent[]> {
        return agents
            .map((agent) => ({
                ...agent,
                score: this.calculateAgentScore(agent.metrics),
                category: this.categorizeAgent(agent.metrics),
                rank: 0,
            }))
            .filter((a) => a.score > 50) // Only trending if score > 50
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((agent, index) => ({
                ...agent,
                rank: index + 1,
            }));
    }

    /**
     * Get agents by category
     */
    getAgentsByCategory(agents: Agent[], category: 'Conservative' | 'Balanced' | 'Aggressive' | 'HighRisk'): RankedAgent[] {
        return agents
            .map((agent) => ({
                ...agent,
                score: this.calculateAgentScore(agent.metrics),
                category: this.categorizeAgent(agent.metrics),
                rank: 0,
            }))
            .filter((a) => a.category === category)
            .sort((a, b) => b.score - a.score)
            .map((agent, index) => ({
                ...agent,
                rank: index + 1,
            }));
    }
}

export default new AgentRankingService();
