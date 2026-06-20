import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

// GET /api/admin/vehicles/locations  — for LiveMap (returns vehicles with GPS from their active shipments)
router.get("/locations", async (_req, res) => {
  try {
    // Get all vehicles with their assigned driver's active shipment location
    const vehicles = await prisma.vehicle.findMany({
      include: {
        driver: { select: { id: true, name: true } },
        shipments: {
          where: { status: { in: ["IN_TRANSIT", "PENDING"] } },
          orderBy: { updatedAt: "desc" },
          take: 1,
          select: { currentLat: true, currentLng: true, lastLocationAt: true, status: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const locations = vehicles
      .map((v) => {
        const activeShipment = v.shipments?.[0];
        const lat = activeShipment?.currentLat ?? null;
        const lng = activeShipment?.currentLng ?? null;

        return {
          id: v.id,
          name: v.vehicleNo,
          type: v.type,
          status: v.status === "IN_TRANSIT" ? "In Transit"
            : v.status === "MAINTENANCE" ? "Maintenance"
            : "Idle",
          driverName: v.driverName || v.driver?.name || null,
          lat,
          lng,
          updatedAt: activeShipment?.lastLocationAt ?? v.updatedAt,
        };
      })
      .filter((v) => v.lat !== null && v.lng !== null); // only vehicles with known location

    return res.json({ ok: true, data: locations });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// GET /api/admin/vehicles
router.get("/", async (req, res) => {
  const data = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  res.json({ ok: true, data });
});

// POST /api/admin/vehicles
router.post("/", async (req, res) => {
  const { vehicleNo, type, status, driverName, lastSeen } = req.body || {};
  if (!vehicleNo || !type) {
    return res.status(400).json({ ok: false, message: "vehicleNo and type are required" });
  }

  const created = await prisma.vehicle.create({
    data: {
      vehicleNo,
      type,
      status: status || "AVAILABLE",
      driverName: driverName || null,
      lastSeen: lastSeen || "Just now",
    },
  });

  res.status(201).json({ ok: true, data: created });
});

// PATCH /api/admin/vehicles/:id
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { type, status, driverName, lastSeen } = req.body || {};

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        type: type ?? undefined,
        status: status ?? undefined,
        driverName: driverName ?? undefined,
        lastSeen: lastSeen ?? undefined,
      },
    });

    res.json({ ok: true, data: updated });
  } catch {
    res.status(404).json({ ok: false, message: "Vehicle not found" });
  }
});

// DELETE /api/admin/vehicles/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.vehicle.delete({ where: { id } });
    res.json({ ok: true, data: deleted });
  } catch {
    res.status(404).json({ ok: false, message: "Vehicle not found" });
  }
});

export default router;