// backend/src/portfolio.ts - Portfolio Management for AGENT CAPITAL

import { OGStorage } from "./og-storage";

export interface PortfolioHolding {
    agentId: number;
    quantity: number;
    purchasePrice: number;
    purchaseDate: number;
    totalDividends: number;
    lastDividendDate: number;
}

export interface UserPortfolio {
    userId: string;
    holdings: Map<number, PortfolioHolding>;
    totalValue: number;
    monthlyEarnings: number;
    totalEarnings: number;
}

export class PortfolioManager {
    private storage: OGStorage;

    constructor(storage: OGStorage) {
        this.storage = storage;
    }

    /**
     * Get or create user portfolio
     */
    async getPortfolio(userId: string): Promise<UserPortfolio> {
        try {
            const key = `portfolio:${userId}`;
            const data = await this.storage.getKV(key);

            if (data) {
                const portfolio = JSON.parse(data);
                portfolio.holdings = new Map(portfolio.holdings);
                return portfolio;
            }
        } catch (error) {
            console.error("Error fetching portfolio:", error);
        }

        return {
            userId,
            holdings: new Map(),
            totalValue: 0,
            monthlyEarnings: 0,
            totalEarnings: 0,
        };
    }

    /**
     * Save portfolio changes
     */
    async savePortfolio(portfolio: UserPortfolio): Promise<void> {
        const key = `portfolio:${portfolio.userId}`;
        const serialized = {
            userId: portfolio.userId,
            holdings: Array.from(portfolio.holdings.entries()),
            totalValue: portfolio.totalValue,
            monthlyEarnings: portfolio.monthlyEarnings,
            totalEarnings: portfolio.totalEarnings,
        };

        await this.storage.setKV(key, JSON.stringify(serialized));

        // Also log to audit trail
        await this.storage.appendLog(
            `portfolio:${portfolio.userId}`,
            { ...serialized, eventType: 'portfolio_updated', timestamp: Date.now() }
        );
    }

    /**
     * Add agent to portfolio (user purchases iNFT)
     */
    async addHolding(userId: string, agentId: number, quantity: number, purchasePrice: number): Promise<void> {
        const portfolio = await this.getPortfolio(userId);

        if (portfolio.holdings.has(agentId)) {
            // Increase existing holding
            const holding = portfolio.holdings.get(agentId)!;
            holding.quantity += quantity;
            holding.totalDividends += quantity * purchasePrice; // Track avg cost
        } else {
            // New holding
            portfolio.holdings.set(agentId, {
                agentId,
                quantity,
                purchasePrice,
                purchaseDate: Date.now(),
                totalDividends: 0,
                lastDividendDate: 0,
            });
        }

        portfolio.totalValue += quantity * purchasePrice;
        await this.savePortfolio(portfolio);
    }

    /**
     * Remove agent from portfolio (user sells iNFT)
     */
    async removeHolding(userId: string, agentId: number, quantity: number): Promise<number> {
        const portfolio = await this.getPortfolio(userId);
        const holding = portfolio.holdings.get(agentId);

        if (!holding) throw new Error("Agent not in portfolio");
        if (holding.quantity < quantity) throw new Error("Insufficient quantity");

        const saleProceeds = quantity * holding.purchasePrice;
        holding.quantity -= quantity;

        if (holding.quantity === 0) {
            portfolio.holdings.delete(agentId);
        }

        portfolio.totalValue -= saleProceeds;
        await this.savePortfolio(portfolio);

        return saleProceeds;
    }

    /**
     * Record dividend payment to holder
     */
    async recordDividend(userId: string, agentId: number, amount: number): Promise<void> {
        const portfolio = await this.getPortfolio(userId);
        const holding = portfolio.holdings.get(agentId);

        if (!holding) return;

        holding.totalDividends += amount;
        holding.lastDividendDate = Date.now();
        portfolio.monthlyEarnings += amount;
        portfolio.totalEarnings += amount;

        await this.savePortfolio(portfolio);
    }

    /**
     * Get portfolio summary
     */
    async getPortfolioSummary(userId: string): Promise<any> {
        const portfolio = await this.getPortfolio(userId);

        return {
            userId,
            holdingCount: portfolio.holdings.size,
            totalValue: portfolio.totalValue,
            monthlyEarnings: portfolio.monthlyEarnings,
            totalEarnings: portfolio.totalEarnings,
            apy: portfolio.totalValue > 0
                ? ((portfolio.monthlyEarnings * 12 * 100) / portfolio.totalValue).toFixed(2)
                : "0",
            holdings: Array.from(portfolio.holdings.values()),
        };
    }

    /**
     * Get top agents for user
     */
    async getTopHoldings(userId: string, limit: number = 5): Promise<any[]> {
        const portfolio = await this.getPortfolio(userId);

        return Array.from(portfolio.holdings.values())
            .sort((a, b) => b.totalDividends - a.totalDividends)
            .slice(0, limit);
    }

    /**
     * Calculate dividend distribution for an agent trade profit
     */
    async distributeDividends(agentId: number, profit: number): Promise<Map<string, number>> {
        // Get all holders of this agent ID from KV store
        const holderShare = (profit * 70) / 100; // 70%
        const breedingFund = (profit * 20) / 100; // 20%
        const platformFee = (profit * 10) / 100; // 10%

        const distributions = new Map<string, number>();

        // In production, fetch actual holders from iNFT contract
        // For now, log the distribution
        await this.storage.appendLog(
            `dividends:${agentId}`,
            {
                agentId,
                profit,
                holderShare,
                breedingFund,
                platformFee,
                eventType: 'dividend_distributed',
                timestamp: Date.now()
            }
        );

        distributions.set("platform", platformFee);
        distributions.set("breeding_fund", breedingFund);

        return distributions;
    }
}
