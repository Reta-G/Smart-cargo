import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

/**
 * GET /api/user/shipments
 * Customer-only: returns shipments that belong to the logged-in user (customerId = req.user.sub)
 * Optional query:
 *  - limit=10
 *  - status=IN_TRANSIT | DELIVERED | PENDING | DELAYED | ALL
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({ ok: false, message: "Missing token" });
    }

    const limit = Math.min(Number(req.query.limit || 50), 200);
    const status = String(req.query.status || "ALL").toUpperCase();

    const where = { customerId: userId };
    if (status !== "ALL") where.status = status;

    const data = await prisma.shipment.findMany({
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

/**
 * ✅ NEW
 * GET /api/user/shipments/:id
 * Customer-only: returns ONE shipment that belongs to the logged-in customer
 */
router.get("/:id", async (req, res) => {
  try {
    const userId = req.user?.sub;
    const id = String(req.params.id || "");

    if (!userId) {
      return res.status(401).json({ ok: false, message: "Missing token" });
    }

    const shipment = await prisma.shipment.findFirst({
      where: {
        id,
        customerId: userId, // ✅ security: must belong to this customer
      },
    });

    if (!shipment) {
      return res.status(404).json({ ok: false, message: "Shipment not found" });
    }

    return res.json({ ok: true, data: shipment });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;