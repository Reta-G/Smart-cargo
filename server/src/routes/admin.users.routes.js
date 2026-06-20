import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma.js";

const router = Router();

// helper: never return passwordHash
const safeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

// GET /api/admin/users?limit=50&role=DRIVER&status=ACTIVE&q=alice
router.get("/", async (req, res) => {
  const { limit, role, status, q } = req.query;

  const take = limit ? Math.min(Number(limit) || 50, 200) : 50;

  const where = {};
  if (role && role !== "ALL") where.role = String(role).toUpperCase();
  if (status && status !== "ALL") where.status = String(status).toUpperCase();

  const query = String(q || "").trim();
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { email: { contains: query } },
      { role: { contains: query.toUpperCase() } },
      { status: { contains: query.toUpperCase() } },
    ];
  }

  const data = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take,
    select: safeSelect,
  });

  res.json({ ok: true, data });
});

// POST /api/admin/users
// body: { name, email, password, role?, status? }
router.post("/", async (req, res) => {
  const { name, email, password, role, status } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      ok: false,
      message: "name, email, password are required",
    });
  }

  const emailLower = String(email).toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: emailLower } });
  if (existing) {
    return res.status(409).json({ ok: false, message: "Email already registered" });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);

  const created = await prisma.user.create({
    data: {
      name: String(name).trim(),
      email: emailLower,
      passwordHash,
      role: role ? String(role).toUpperCase() : "CUSTOMER",
      status: status ? String(status).toUpperCase() : "ACTIVE",
    },
    select: safeSelect,
  });

  res.status(201).json({ ok: true, data: created });
});

// PATCH /api/admin/users/:id
// body can include: name, role, status
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, status } = req.body || {};

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: name ?? undefined,
        role: role ? String(role).toUpperCase() : undefined,
        status: status ? String(status).toUpperCase() : undefined,
      },
      select: safeSelect,
    });

    res.json({ ok: true, data: updated });
  } catch {
    res.status(404).json({ ok: false, message: "User not found" });
  }
});

// DELETE /api/admin/users/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // (optional safety) prevent deleting yourself
    if (req.user?.sub === id) {
      return res.status(400).json({ ok: false, message: "You cannot delete your own account." });
    }

    const deleted = await prisma.user.delete({
      where: { id },
      select: safeSelect,
    });

    res.json({ ok: true, data: deleted });
  } catch {
    res.status(404).json({ ok: false, message: "User not found" });
  }
});

export default router;