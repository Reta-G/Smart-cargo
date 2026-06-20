import { Router } from "express";
import { prisma } from "../prisma.js";
import crypto from "crypto";

const router = Router();

/**
 * POST /api/admin/shipments
 * Admin: create a new shipment directly
 */
router.post("/", async (req, res) => {
  try {
    const { client, origin, destination, status, eta, driverId, vehicleId } = req.body || {};

    if (!client || !origin || !destination) {
      return res.status(400).json({ ok: false, message: "client, origin, destination are required" });
    }

    const shipmentNo = `SHP-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    const data = {
      shipmentNo,
      client: String(client).trim(),
      origin: String(origin).trim(),
      destination: String(destination).trim(),
      status: status || "PENDING",
      eta: eta || null,
    };

    if (driverId) {
      const driver = await prisma.user.findUnique({ where: { id: driverId }, select: { id: true, name: true, role: true } });
      if (driver && driver.role === "DRIVER") {
        data.driverId = driver.id;
        data.driverName = driver.name;
      }
    }

    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
      if (vehicle) data.vehicleId = vehicle.id;
    }

    const shipment = await prisma.shipment.create({ data });
    return res.status(201).json({ ok: true, data: shipment });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * DELETE /api/admin/shipments/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await prisma.shipment.delete({ where: { id: req.params.id } });
    return res.json({ ok: true, data: deleted });
  } catch {
    return res.status(404).json({ ok: false, message: "Shipment not found" });
  }
});

/**
 * POST /api/admin/shipments/:id/proof-of-delivery
 * Admin or driver marks delivery complete with notes and timestamp.
 * In a full system this would accept file uploads; here we store text proof.
 */
router.post("/:id/proof-of-delivery", async (req, res) => {
  try {
    const id = String(req.params.id || "");
    const { deliveryNotes, recipientName, deliveredAt } = req.body || {};

    const shipment = await prisma.shipment.findUnique({ where: { id } });
    if (!shipment) return res.status(404).json({ ok: false, message: "Shipment not found" });

    const updated = await prisma.shipment.update({
      where: { id },
      data: {
        status: "DELIVERED",
        deliveryNotes: deliveryNotes ? String(deliveryNotes).trim() : null,
        recipientName: recipientName ? String(recipientName).trim() : null,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : new Date(),
      },
    });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * GET /api/admin/shipments
 * Admin-only (protected in server.js)
 *
 * Optional query:
 *  - limit=50 (max 200)
 *  - status=PENDING|IN_TRANSIT|DELIVERED|DELAYED|ALL
 *  - q=search text (shipmentNo/client/origin/destination)
 */
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const status = String(req.query.status || "ALL").toUpperCase();
    const q = String(req.query.q || "").trim();

    const where = {};

    if (status !== "ALL") where.status = status;

    if (q) {
      where.OR = [
        { shipmentNo: { contains: q } },
        { client: { contains: q } },
        { origin: { contains: q } },
        { destination: { contains: q } },
      ];
    }

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
 * PATCH /api/admin/shipments/:id
 * Admin-only: update shipment fields
 *
 * body (any of them):
 *  - status: PENDING | IN_TRANSIT | DELIVERED | DELAYED
 *  - eta: string | null
 *  - driverId: DRIVER user id | null
 *  - vehicleId: vehicle id | null
 *
 * ✅ professional assignment:
 *  - driverId: DRIVER user id | null
 *    (server will set driverName automatically)
 *  - vehicleId: vehicle id | null
 *    (optional: assign a vehicle to this shipment)
 */
router.patch("/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "");
    const { status, eta, driverId, driverName, vehicleId } = req.body || {};

    const data = {};

    // status
    if (status !== undefined) {
      const s = String(status).toUpperCase();
      const allowed = ["PENDING", "IN_TRANSIT", "DELIVERED", "DELAYED"];
      if (!allowed.includes(s)) {
        return res.status(400).json({
          ok: false,
          message: `Invalid status. Allowed: ${allowed.join(", ")}`,
        });
      }
      data.status = s;
    }

    // eta
    if (eta !== undefined) {
      if (eta === null || eta === "") data.eta = null;
      else data.eta = String(eta).trim();
    }

    // ✅ driver assignment by driverId (recommended)
    if (driverId !== undefined) {
      // Unassign
      if (driverId === null || driverId === "" || driverId === "Unassigned") {
        data.driverId = null;
        data.driverName = null;
      } else {
        const did = String(driverId).trim();

        const driver = await prisma.user.findUnique({
          where: { id: did },
          select: { id: true, name: true, role: true, status: true },
        });

        if (!driver) {
          return res.status(400).json({ ok: false, message: "Driver not found" });
        }
        if (driver.role !== "DRIVER") {
          return res.status(400).json({ ok: false, message: "User is not a DRIVER" });
        }
        if (driver.status && driver.status !== "ACTIVE") {
          return res.status(400).json({ ok: false, message: "Driver is not ACTIVE" });
        }

        data.driverId = driver.id;
        data.driverName = driver.name; // keep display field synced
      }
    } else if (driverName !== undefined) {
      // Backward compatible mode (not recommended):
      // set driverName text and clear driverId to avoid mismatch
      if (driverName === null || driverName === "" || driverName === "Unassigned") {
        data.driverId = null;
        data.driverName = null;
      } else {
        data.driverId = null;
        data.driverName = String(driverName).trim();
      }
    }

    // ✅ vehicle assignment by vehicleId (optional)
    if (vehicleId !== undefined) {
      if (vehicleId === null || vehicleId === "" || vehicleId === "Unassigned") {
        data.vehicleId = null;
      } else {
        const vid = String(vehicleId).trim();

        const vehicle = await prisma.vehicle.findUnique({
          where: { id: vid },
          select: { id: true, vehicleNo: true, status: true },
        });

        if (!vehicle) {
          return res.status(400).json({ ok: false, message: "Vehicle not found" });
        }

        data.vehicleId = vehicle.id;
      }
    }

    const updated = await prisma.shipment.update({
      where: { id },
      data,
    });

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error(e);
    return res.status(404).json({ ok: false, message: "Shipment not found" });
  }
});

export default router;