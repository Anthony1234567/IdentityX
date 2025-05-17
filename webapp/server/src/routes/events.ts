import express, { Request, Response } from "express";
import { verifyToken, AuthenticatedRequest } from "../middleware/auth";
import Event, { IEvent } from "../models/Event";
import Connection from "../models/Connection"; // Ensure Connection model is imported

const router = express.Router();

// GET /api/events/:connectionId - Events for a specific connection
router.get(
  "/:connectionId",
  verifyToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { connectionId } = req.params;

      const connection = await Connection.findOne({
        _id: connectionId,
        userId: userId?.toString(), // ensure string
      });
      if (!connection) {
        res.status(404).json({ error: "Connection not found" });
        return;
      }

      console.log("Matching against", {
        userId: userId?.toString(),
        provider: connection.provider,
        accountName: connection.accountName,
      });

      const events = await Event.find({
        userId: userId?.toString(), // enforce string match
        provider: connection.provider,
        accountName: connection.accountName,
      }).sort({ timestamp: -1 });

      res.json(events); // no 'return' here
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  }
);

// GET /api/events/summary/:range
router.get(
  "/summary/:range",
  verifyToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const { range } = req.params;

      const now = new Date();
      const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      const connections = await Connection.find({ userId });

      const events: IEvent[] = await Event.find({
        userId,
        timestamp: { $gte: startDate },
      });

      const accountKeys = new Set(
        connections.map((c) => `${c.provider}:${c.accountName}`)
      );
      const totalAccounts = accountKeys.size;

      const relevantEvents = await Event.find({
        userId: userId?.toString(),
        timestamp: { $gte: startDate },
        type: { $in: ["login", "logout"] },
        provider: { $in: connections.map((c) => c.provider) },
        accountName: { $in: connections.map((c) => c.accountName) },
      });

      const totalLogins = relevantEvents.filter(
        (e) => e.type === "login"
      ).length;
      const totalLogouts = relevantEvents.filter(
        (e) => e.type === "logout"
      ).length;
      const totalActiveSessions = totalLogins - totalLogouts;

      const isoDate = startDate.toISOString();

      const trendData = await Event.aggregate([
        {
          $match: {
            userId: userId?.toString(),
            timestamp: { $gte: isoDate }, // compare ISO strings
            type: "login",
          },
        },
        {
          $group: {
            _id: {
              date: {
                $substr: ["$timestamp", 0, 10], // get "YYYY-MM-DD"
              },
              provider: "$provider",
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.date": 1 } },
        {
          $project: {
            _id: 0,
            date: "$_id.date",
            provider: "$_id.provider",
            count: 1,
          },
        },
      ]);

      res.json({
        totalAccounts,
        totalLogins,
        totalActiveSessions,
        trendData,
        rawEvents: relevantEvents,
      });
    } catch (error) {
      console.error("Error in event summary:", error);
      res.status(500).json({ error: "Failed to generate event summary" });
    }
  }
);

export default router;
