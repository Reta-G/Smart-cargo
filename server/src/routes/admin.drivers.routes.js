import { Router } from "express";
import { prisma } from "../prisma.js";

const router = Router();

/**
 * GET /api/admin/drivers
 * Admin-only: list driver users for dropdown
 */
router.get("/", async (_req, res) => {
  try {
    const data = await prisma.user.findMany({
      where: { role: "DRIVER", status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    return res.json({ ok: true, data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

export default router;