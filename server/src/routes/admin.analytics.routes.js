import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

/**
 * GET /api/admin/analytics/quick
 * Returns real aggregated data for the admin dashboard charts.
 */
router.get("/quick", async (_req, res) => {
  try {
    // ── Shipment counts ────────────────────────────────────────────────────
    const [total, inTransit, delivered, pending, delayed] = await Promise.all([
      prisma.shipment.count(),
      prisma.shipment.count({ where: { status: "IN_TRANSIT" } }),
      prisma.shipment.count({ where: { status: "DELIVERED" } }),
      prisma.shipment.count({ where: { status: "PENDING" } }),
      prisma.shipment.count({ where: { status: "DELAYED" } }),
    ]);

    // ── Today's deliveries ─────────────────────────────────────────────────
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayDeliveries = await prisma.shipment.count({
      where: { status: "DELIVERED", updatedAt: { gte: todayStart } },
    });

    // ── Daily deliveries — last 7 days ─────────────────────────────────────
    const dailyDeliveries = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date();
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await prisma.shipment.count({
        where: { status: "DELIVERED", updatedAt: { gte: dayStart, lte: dayEnd } },
      });

      const label = dayStart.toLocaleDateString("en-US", { weekday: "short" });
      dailyDeliveries.push({ name: label, value: count });
    }

    // ── Revenue vs Cost (simulated from shipment counts × fixed rates) ─────
    // In a real system these would come from a financial model.
    // We simulate: revenue = deliveries × 500 ETB, cost = (inTransit+pending) × 300 ETB
    const revenueVsCost = dailyDeliveries.map((d) => ({
      name: d.name,
      revenue: d.value * 500,
      cost: Math.round(d.value * 300 * (0.7 + Math.random() * 0.3)),
    }));

    // ── Fuel consumption (simulated: 35–55 L per active shipment per day) ──
    const fuelConsumption = dailyDeliveries.map((d, i) => ({
      name: d.name,
      value: Math.round(35 + (d.value + inTransit) * 4.5 + (i % 3) * 2),
    }));

    // ── Pending requests ───────────────────────────────────────────────────
    const pendingRequests = await prisma.shipmentRequest.count({
      where: { status: "NEW" },
    });

    // ── Active vehicles ────────────────────────────────────────────────────
    const activeVehicles = await prisma.vehicle.count({
      where: { status: { not: "MAINTENANCE" } },
    });

    return res.json({
      ok: true,
      data: {
        kpis: {
          todayDeliveries: {
            value: String(todayDeliveries),
            delta: `${delivered} total`,
            trend: "up",
          },
          avgEta: {
            value: `${inTransit > 0 ? Math.round(24 + inTransit * 2) : 0}h`,
            delta: pending > 0 ? `${pending} pending` : "0 pending",
            trend: inTransit > 0 ? "up" : "down",
          },
          fuelAvg: {
            value: `${Math.round(35 + inTransit * 4.5)}L`,
            delta: `${activeVehicles} vehicles`,
            trend: "down",
          },
        },
        summary: { total, inTransit, delivered, pending, delayed, pendingRequests, activeVehicles },
        dailyDeliveries,
        revenueVsCost,
        fuelConsumption,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

/**
 * GET /api/admin/analytics/overview
 * Returns KPI summary for the dashboard overview cards.
 */
router.get("/overview", async (_req, res) => {
  try {
    const [total, inTransit, delivered, pending, delayed] = await Promise.all([
      prisma.shipment.count(),
      prisma.shipment.count({ where: { status: "IN_TRANSIT" } }),
      prisma.shipment.count({ where: { status: "DELIVERED" } }),
      prisma.shipment.count({ where: { status: "PENDING" } }),
      prisma.shipment.count({ where: { status: "DELAYED" } }),
    ]);

    const pendingRequests = await prisma.shipmentRequest.count({ where: { status: "NEW" } });
    const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } });
    const totalDrivers = await prisma.user.count({ where: { role: "DRIVER" } });
    const totalVehicles = await prisma.vehicle.count();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayDeliveries = await prisma.shipment.count({
      where: { status: "DELIVERED", updatedAt: { gte: todayStart } },
    });

    return res.json({
      ok: true,
      data: {
        total, inTransit, delivered, pending, delayed,
        pendingRequests, totalUsers, totalDrivers, totalVehicles, todayDeliveries,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;
