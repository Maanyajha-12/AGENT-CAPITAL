// backend/src/routes/agent-capital-api.ts - AGENT CAPITAL REST API Routes

import { Router, Request, Response } from "express";
import { PortfolioManager } from "../portfolio";
import { AgentEconomicsTracker } from "../agent-economics";
import { OGStorage } from "../og-storage";

export function createAgentCapitalRoutes(
    portfolioManager: PortfolioManager,
    economicsTracker: AgentEconomicsTracker,
    storage: OGStorage
): Router {
    const router = Router();

    // ============================================================================
    // PORTFOLIO ENDPOINTS
    // ============================================================================

    /**
     * GET /api/portfolio/:userId
     * Get user's portfolio summary and holdings
     */
    router.get("/portfolio/:userId", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const summary = await portfolioManager.getPortfolioSummary(userId);
            res.json(summary);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    /**
     * POST /api/portfolio/:userId/buy
     * User purchases agent iNFT
     */
    router.post("/portfolio/:userId/buy", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { agentId, quantity, price } = req.body;

            await portfolioManager.addHolding(userId, agentId, quantity, price);
            const summary = await portfolioManager.getPortfolioSummary(userId);

            res.json({
                status: "success",
                message: `Purchased ${quantity} units of Agent ${agentId}`,
                portfolio: summary,
            });
        } catch (error) {
            res.status(400).json({ error: String(error) });
        }
    });

    /**
     * POST /api/portfolio/:userId/sell
     * User sells agent iNFT
     */
    router.post("/portfolio/:userId/sell", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const { agentId, quantity } = req.body;

            const proceeds = await portfolioManager.removeHolding(userId, agentId, quantity);
            const summary = await portfolioManager.getPortfolioSummary(userId);

            res.json({
                status: "success",
                message: `Sold ${quantity} units of Agent ${agentId}`,
                proceeds,
                portfolio: summary,
            });
        } catch (error) {
            res.status(400).json({ error: String(error) });
        }
    });

    /**
     * GET /api/portfolio/:userId/top-holdings
     * Get user's top-performing holdings
     */
    router.get("/portfolio/:userId/top-holdings", async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit as string) || 5;
            const topHoldings = await portfolioManager.getTopHoldings(userId, limit);

            res.json(topHoldings);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    // ============================================================================
    // AGENT METRICS & PERFORMANCE
    // ============================================================================

    /**
     * GET /api/agent/:agentId/metrics
     * Get detailed agent performance metrics
     */
    router.get("/agent/:agentId/metrics", async (req: Request, res: Response) => {
        try {
            const { agentId } = req.params;
            const metrics = await economicsTracker.calculateAgentMetrics(parseInt(agentId));

            res.json(metrics);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    /**
     * GET /api/agent/:agentId/trades
     * Get agent trade history
     */
    router.get("/agent/:agentId/trades", async (req: Request, res: Response) => {
        try {
            const { agentId } = req.params;
            const limit = parseInt(req.query.limit as string) || 100;
            const trades = await economicsTracker.getAgentTradeHistory(parseInt(agentId), limit);

            res.json({
                agentId: parseInt(agentId),
                tradeCount: trades.length,
                trades,
            });
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    /**
     * POST /api/agent/:agentId/trade
     * Record a new trade (after 0G Compute verification)
     */
    router.post("/agent/:agentId/trade", async (req: Request, res: Response) => {
        try {
            const { agentId } = req.params;
            const { tradeId, action, amount, profit, proofHash } = req.body;

            const trade = {
                tradeId,
                agentId: parseInt(agentId),
                action,
                amount,
                profit,
                proofHash,
                timestamp: Date.now(),
                executed: true,
            };

            await economicsTracker.recordTrade(trade);

            // Calculate dividend distributions
            const distributions = await portfolioManager.distributeDividends(
                parseInt(agentId),
                profit
            );

            res.json({
                status: "success",
                trade,
                distributions: Object.fromEntries(distributions),
            });
        } catch (error) {
            res.status(400).json({ error: String(error) });
        }
    });

    /**
     * GET /api/agent/:agentId/breeding
     * Get breeding history for agent
     */
    router.get("/agent/:agentId/breeding", async (req: Request, res: Response) => {
        try {
            const { agentId } = req.params;
            const history = await economicsTracker.getBreedingHistory(parseInt(agentId));

            res.json({
                agentId: parseInt(agentId),
                breedingCount: history.length,
                history,
            });
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    /**
     * POST /api/agent/breed
     * Record breeding event
     */
    router.post("/agent/breed", async (req: Request, res: Response) => {
        try {
            const { parent1, parent2, childId } = req.body;

            await economicsTracker.recordBreeding(parent1, parent2, childId);

            res.json({
                status: "success",
                message: `Agents ${parent1} and ${parent2} bred successfully`,
                childId,
            });
        } catch (error) {
            res.status(400).json({ error: String(error) });
        }
    });

    // ============================================================================
    // PLATFORM ECONOMICS
    // ============================================================================

    /**
     * GET /api/platform/economics
     * Get platform-wide economic metrics
     */
    router.get("/platform/economics", async (req: Request, res: Response) => {
        try {
            const economics = await economicsTracker.getPlatformEconomics();
            res.json(economics);
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    /**
     * GET /api/platform/leaderboard
     * Get top-performing agents by APY
     */
    router.get("/platform/leaderboard", async (req: Request, res: Response) => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const leaderboard = await economicsTracker.getLeaderboard(limit);

            res.json({
                limit,
                agents: leaderboard,
            });
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    /**
     * GET /api/platform/volume
     * Get marketplace trading volume
     */
    router.get("/platform/volume", async (req: Request, res: Response) => {
        try {
            // In production, fetch from MarketplaceTracker
            res.json({
                dailyVolume: 500000,
                weeklyVolume: 3500000,
                monthlyVolume: 15000000,
                allTimeVolume: 42000000,
                timestamp: Date.now(),
            });
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    /**
     * GET /api/platform/stats
     * Get comprehensive platform statistics
     */
    router.get("/platform/stats", async (req: Request, res: Response) => {
        try {
            const economics = await economicsTracker.getPlatformEconomics();

            res.json({
                platform: {
                    activeAgents: economics?.totalAgents || 0,
                    totalValueLocked: economics?.totalTVL || 0,
                    totalTradesExecuted: economics?.totalTrades || 0,
                    totalRevenue: economics?.totalRevenue || 0,
                    platformFeesCollected: economics?.platformFeeGenerated || 0,
                },
                market: {
                    averageAgentAPY: economics?.averageAPY || 0,
                    topPerformers: economics?.topPerformers || [],
                },
                timestamp: Date.now(),
            });
        } catch (error) {
            res.status(500).json({ error: String(error) });
        }
    });

    return router;
}
