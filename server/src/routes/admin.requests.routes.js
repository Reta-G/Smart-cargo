import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

/**
 * GET /api/admin/requests
 * query:
 *  - limit=50 (max 200)
 *  - status=NEW|APPROVED|REJECTED|ALL
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const status = String(req.query.status || "ALL").toUpperCase();

    const where = {};
    if (status !== "ALL") where.status = status;

    const data = await prisma.shipmentRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    return res.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * PATCH /api/admin/requests/:id/status
 * body: { status: "APPROVED" | "REJECTED" | "NEW" }
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const id = String(req.params.id || "");
    const status = String(req.body?.status || "").toUpperCase();

    if (!["NEW", "APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "status must be NEW, APPROVED, or REJECTED",
      });
    }

    const updated = await prisma.shipmentRequest.update({
      where: { id },
      data: { status },
    });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    return res.status(404).json({ ok: false, message: "Request not found" });
  }
});

/**
 * ✅ NEW
 * POST /api/admin/requests/:id/convert
 * Approves the request and creates a real Shipment for the same customer.
 *
 * Result:
 * - request.status -> APPROVED
 * - creates Shipment with:
 *    shipmentNo = requestNo but "REQ-" becomes "SHP-"
 *    origin/destination from request
 *    customerId from request
 *    client = customer name (or email)
 *    status = PENDING
 */
router.post("/:id/convert", async (req, res) => {
  try {
    const id = String(req.params.id || "");

    const request = await prisma.shipmentRequest.findUnique({
      where: { id },
      include: { customer: { select: { id: true, name: true, email: true } } },
    });

    if (!request) {
      return res.status(404).json({ ok: false, message: "Request not found" });
    }

    if (request.status === "REJECTED") {
      return res.status(400).json({
        ok: false,
        message: "Cannot convert a REJECTED request",
      });
    }

    // Make shipmentNo from requestNo (unique & stable)
    const shipmentNo = request.requestNo.startsWith("REQ-")
      ? request.requestNo.replace("REQ-", "SHP-")
      : `SHP-${request.requestNo}`;

    // Ensure request is APPROVED
    const updatedRequest = await prisma.shipmentRequest.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    // Try create shipment (if already created before, return the existing one)
    let shipment;
    try {
      shipment = await prisma.shipment.create({
        data: {
          shipmentNo,
          client: request.customer?.name || request.customer?.email || "Customer",
          origin: request.origin,
          destination: request.destination,
          status: "PENDING",
          eta: null,
          driverName: null,
          driverId: null,
          customerId: request.customerId,
        },
      });
    } catch (e) {
      // If shipmentNo already exists (admin clicked convert twice), fetch existing
      shipment = await prisma.shipment.findUnique({ where: { shipmentNo } });
      if (!shipment) throw e;
    }

    return res.json({
      ok: true,
      data: { request: updatedRequest, shipment },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;