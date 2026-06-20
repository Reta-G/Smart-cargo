import { Router } from "express";
import crypto from "crypto";
import { prisma } from "../prisma.js";

const router = Router();

const makeRequestNo = () => {
  // Example: REQ-9F3A1C2B
  return `REQ-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
};

/**
 * POST /api/user/requests
 * Customer-only (protected in server.js):
 * Create a shipment request (order) that admin will later approve.
 *
 * body:
 *  - origin (required)
 *  - destination (required)
 *  - cargoType (optional)
 *  - weightKg (optional number)
 *  - notes (optional)
 */
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ ok: false, message: "Missing token" });

    const { origin, destination, cargoType, weightKg, notes } = req.body || {};

    if (!origin || !destination) {
      return res.status(400).json({
        ok: false,
        message: "origin and destination are required",
      });
    }

    const weight =
      weightKg === null || weightKg === undefined || weightKg === ""
        ? null
        : Number(weightKg);

    if (weight !== null && (Number.isNaN(weight) || weight < 0)) {
      return res.status(400).json({
        ok: false,
        message: "weightKg must be a positive number",
      });
    }

    // create with unique requestNo (extremely low chance of collision)
    const requestNo = makeRequestNo();

    const data = await prisma.shipmentRequest.create({
      data: {
        requestNo,
        origin: String(origin).trim(),
        destination: String(destination).trim(),
        cargoType: cargoType ? String(cargoType).trim() : null,
        weightKg: weight,
        notes: notes ? String(notes).trim() : null,
        status: "NEW",
        customerId: userId,
      },
    });

    return res.status(201).json({ ok: true, data });
  } catch (e) {
    // if requestNo collides (rare), user can retry
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * GET /api/user/requests
 * Customer-only: list my requests
 * query:
 *  - limit=50 (max 200)
 *  - status=NEW | APPROVED | REJECTED | ALL
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ ok: false, message: "Missing token" });

    const limit = Math.min(Number(req.query.limit || 50), 200);
    const status = String(req.query.status || "ALL").toUpperCase();

    const where = { customerId: userId };
    if (status !== "ALL") where.status = status;

    const data = await prisma.shipmentRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return res.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;