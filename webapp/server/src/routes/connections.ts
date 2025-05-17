// routes/connections.ts
import express, { Request, Response } from "express";
import Connection from "../models/Connection";
import { verifyToken, AuthenticatedRequest } from "../middleware/auth";

const router = express.Router();

// GET all connections for a user
router.get(
  "/",
  verifyToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const connections = await Connection.find({ userId });
      res.json(connections);
    } catch (err) {
      console.error("Fetch connections error:", err);
      res.status(500).json({ error: "Failed to fetch connections" });
    }
  }
);

// POST new connection
router.post(
  "/",
  verifyToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { provider, accountName } = req.body;
    try {
      const userId = req.user?.id;
      const newConn = await Connection.create({
        userId,
        provider,
        accountName,
      });
      res.status(201).json(newConn);
    } catch (err) {
      console.error("Add connection error:", err);
      res.status(500).json({ error: "Failed to add connection" });
    }
  }
);

// DELETE a connection
router.delete(
  "/:id",
  verifyToken,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const connection = await Connection.findOneAndDelete({
        _id: req.params.id,
        userId: req.user?.id,
      });
      if (!connection) {
        res.status(404).json({ error: "Not found" });
        return;
      }
      res.status(204).end();
    } catch (err) {
      console.error("Delete connection error:", err);
      res.status(500).json({ error: "Failed to delete connection" });
    }
  }
);

export default router;
