import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

const validStatuses = ["PENDING", "IN_TRANSIT", "DELIVERED", "DELAYED"];

router.get("/", async (req, res) => {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ ok: false, message: "Missing token" });
    }

    const limit = Math.min(Number(req.query.limit || 50), 200);
    const data = await prisma.shipment.findMany({
      where: { driverId: userId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return res.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.patch("/:id/location", async (req, res) => {
  try {
    const userId = req.user?.sub;
    const id = String(req.params.id || "");
    const lat = Number(req.body?.lat);
    const lng = Number(req.body?.lng);

    if (!userId) {
      return res.status(401).json({ ok: false, message: "Missing token" });
    }
    if (!id) {
      return res.status(400).json({ ok: false, message: "Shipment id is required" });
    }
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ ok: false, message: "Invalid latitude or longitude" });
    }

    const shipment = await prisma.shipment.findFirst({
      where: { id, driverId: userId },
    });
    if (!shipment) {
      return res.status(404).json({ ok: false, message: "Shipment not found" });
    }

    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        currentLat: lat,
        currentLng: lng,
        lastLocationAt: new Date(),
      },
    });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

router.patch("/:id/status", async (req, res) => {
  try {
    const userId = req.user?.sub;
    const id = String(req.params.id || "");
    const status = String(req.body?.status || "").toUpperCase();

    if (!userId) {
      return res.status(401).json({ ok: false, message: "Missing token" });
    }
    if (!id) {
      return res.status(400).json({ ok: false, message: "Shipment id is required" });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ ok: false, message: "Invalid status" });
    }

    const shipment = await prisma.shipment.findFirst({
      where: { id, driverId: userId },
    });
    if (!shipment) {
      return res.status(404).json({ ok: false, message: "Shipment not found" });
    }

    const updated = await prisma.shipment.update({
      where: { id },
      data: { status },
    });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * POST /api/driver/shipments/:id/proof-of-delivery
 * Driver submits proof of delivery: recipient name, notes, timestamp.
 */
router.post("/:id/proof-of-delivery", async (req, res) => {
  try {
    const userId = req.user?.sub;
    const id = String(req.params.id || "");
    const { recipientName, deliveryNotes } = req.body || {};

    if (!userId) return res.status(401).json({ ok: false, message: "Missing token" });

    const shipment = await prisma.shipment.findFirst({ where: { id, driverId: userId } });
    if (!shipment) return res.status(404).json({ ok: false, message: "Shipment not found" });

    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        status: "DELIVERED",
        recipientName: recipientName ? String(recipientName).trim() : null,
        deliveryNotes: deliveryNotes ? String(deliveryNotes).trim() : null,
        deliveredAt: new Date(),
      },
    });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
