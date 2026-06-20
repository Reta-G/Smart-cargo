import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import pkg from "validator";
const { isEmail } = pkg;

import { prisma } from "./src/prisma.js";
import adminVehiclesRoutes from "./src/routes/admin.vehicles.routes.js";
import adminShipmentsRoutes from "./src/routes/admin.shipments.routes.js";
import adminUsersRoutes from "./src/routes/admin.users.routes.js";
import userShipmentsRoutes from "./src/routes/user.shipments.routes.js";
import userRequestsRoutes from "./src/routes/user.requests.routes.js";
import adminRequestsRoutes from "./src/routes/admin.requests.routes.js";
import adminDriversRoutes from "./src/routes/admin.drivers.routes.js";
import driverShipmentsRoutes from "./src/routes/driver.shipments.routes.js";
import adminAnalyticsRoutes from "./src/routes/admin.analytics.routes.js";
dotenv.config();

// ── Fail fast if critical env vars are missing ────────────────────────────────
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("❌ JWT_SECRET must be set and at least 32 characters long.");
  process.exit(1);
}

const app = express();

// ── Security headers (helmet) ─────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow map tiles etc.
    contentSecurityPolicy: false, // disabled — frontend is served separately
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
const normalizeOrigin = (v) => String(v || "").trim().replace(/\/$/, "");
const stripQuotes = (v) => String(v || "").trim().replace(/^['"]|['"]$/g, "");

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((x) => normalizeOrigin(stripQuotes(x)))
  .filter(Boolean);

console.log("✅ CORS allowed origins:", allowedOrigins);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const incoming = normalizeOrigin(origin);
      if (allowedOrigins.includes(incoming)) return cb(null, true);
      return cb(new Error("CORS blocked: " + incoming));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "100kb" })); // prevent oversized payloads

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many attempts. Please try again later." },
});

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many messages. Please try again later." },
});

const quoteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, message: "Too many quote requests. Please slow down." },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const JWT_SECRET = process.env.JWT_SECRET; // already validated above

const MAX_NAME_LEN = 100;
const MAX_EMAIL_LEN = 254;
const MAX_PASSWORD_LEN = 128;
const MAX_TEXT_LEN = 2000;

const sanitizeStr = (v, max = MAX_TEXT_LEN) =>
  String(v || "").trim().slice(0, max);

const createToken = (user) => {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ ok: false, message: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { sub, role, email }
    return next();
  } catch {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ ok: false, message: "Admin only" });
  }
  return next();
};

const requireCustomer = (req, res, next) => {
  if (req.user?.role !== "CUSTOMER") {
    return res.status(403).json({ ok: false, message: "Customer only" });
  }
  return next();
};

const requireDriver = (req, res, next) => {
  if (req.user?.role !== "DRIVER") {
    return res.status(403).json({ ok: false, message: "Driver only" });
  }
  return next();
};

// --------------------
// Admin routers (protected)
// --------------------
app.use("/api/admin/vehicles", requireAuth, requireAdmin, adminVehiclesRoutes);
app.use("/api/admin/shipments", requireAuth, requireAdmin, adminShipmentsRoutes);
app.use("/api/admin/users", requireAuth, requireAdmin, adminUsersRoutes);
app.use("/api/admin/drivers", requireAuth, requireAdmin, adminDriversRoutes);
app.use("/api/admin/analytics", requireAuth, requireAdmin, adminAnalyticsRoutes);
// --------------------
// User routers (protected)
// --------------------
app.use("/api/user/shipments", requireAuth, requireCustomer, userShipmentsRoutes);
app.use("/api/user/requests", requireAuth, requireCustomer, userRequestsRoutes);
app.use("/api/admin/requests", requireAuth, requireAdmin, adminRequestsRoutes);
app.use("/api/driver/shipments", requireAuth, requireDriver, driverShipmentsRoutes);

// --------------------
// Health
// --------------------
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "API working" });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const name = sanitizeStr(req.body?.name, MAX_NAME_LEN);
    const email = sanitizeStr(req.body?.email, MAX_EMAIL_LEN).toLowerCase();
    const password = sanitizeStr(req.body?.password, MAX_PASSWORD_LEN);

    if (!name || !email || !password) {
      return res.status(400).json({ ok: false, message: "name, email, password are required" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, message: "Invalid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, message: "Password must be at least 6 characters" });
    }

    if (ADMIN_EMAIL && email === ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ ok: false, message: "Admin accounts cannot be created from public registration." });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ ok: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "CUSTOMER" },
      select: { id: true, name: true, email: true, role: true },
    });

    const accessToken = createToken(user);
    return res.status(201).json({ ok: true, accessToken, user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const email = sanitizeStr(req.body?.email, MAX_EMAIL_LEN).toLowerCase();
    const password = sanitizeStr(req.body?.password, MAX_PASSWORD_LEN);

    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "email and password are required" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, message: "Invalid email address" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ ok: false, message: "Invalid email or password" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ ok: false, message: "Invalid email or password" });
    }

    const accessToken = createToken(user);
    return res.json({
      ok: true,
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ── Contact ───────────────────────────────────────────────────────────────────
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const name    = sanitizeStr(req.body?.name, MAX_NAME_LEN);
    const email   = sanitizeStr(req.body?.email, MAX_EMAIL_LEN).toLowerCase();
    const subject = sanitizeStr(req.body?.subject, 200);
    const message = sanitizeStr(req.body?.message, MAX_TEXT_LEN);

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, message: "All fields are required" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, message: "Invalid email address" });
    }

    const msg = await prisma.message.create({
      data: { name, email, subject, message, read: false },
    });

    return res.status(201).json({ ok: true, message: "Message received", data: msg });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// ── AI Instant Quote (public, rate-limited) ───────────────────────────────────
// Calculates a transparent landed-cost estimate based on cargo details.
// No external AI API needed — uses a deterministic pricing model.
app.post("/api/quote", quoteLimiter, async (req, res) => {
  try {
    const origin      = sanitizeStr(req.body?.origin, 200);
    const destination = sanitizeStr(req.body?.destination, 200);
    const cargoType   = sanitizeStr(req.body?.cargoType, 100) || "General";
    const weightKg    = Number(req.body?.weightKg) || 0;
    const volumeM3    = Number(req.body?.volumeM3) || 0;
    const urgent      = Boolean(req.body?.urgent);

    if (!origin || !destination) {
      return res.status(400).json({ ok: false, message: "origin and destination are required" });
    }
    if (weightKg < 0 || weightKg > 50000) {
      return res.status(400).json({ ok: false, message: "weightKg must be between 0 and 50,000" });
    }

    // ── Pricing model (ETB — Ethiopian Birr) ──────────────────────────────────
    const BASE_RATE_PER_KG   = 12;   // ETB per kg
    const BASE_RATE_PER_M3   = 800;  // ETB per cubic meter
    const MIN_CHARGE         = 500;  // minimum shipment charge
    const FUEL_SURCHARGE_PCT = 0.08; // 8%
    const HANDLING_FEE       = 250;  // flat handling
    const URGENT_MULTIPLIER  = 1.35; // 35% premium for urgent

    // Cargo type multipliers
    const cargoMultipliers = {
      "Hazardous":    1.8,
      "Refrigerated": 1.6,
      "Fragile":      1.4,
      "Electronics":  1.3,
      "Machinery":    1.2,
      "Textiles":     1.0,
      "Food":         1.1,
      "General":      1.0,
    };
    const cargoKey = Object.keys(cargoMultipliers).find(
      (k) => k.toLowerCase() === cargoType.toLowerCase()
    ) || "General";
    const cargoMult = cargoMultipliers[cargoKey];

    // Chargeable weight: greater of actual weight or volumetric weight (1 m³ = 333 kg)
    const volumetricWeight = volumeM3 * 333;
    const chargeableWeight = Math.max(weightKg, volumetricWeight, 1);

    // Base freight
    const freightCost = Math.max(
      chargeableWeight * BASE_RATE_PER_KG * cargoMult,
      volumeM3 > 0 ? volumeM3 * BASE_RATE_PER_M3 * cargoMult : 0,
      MIN_CHARGE
    );

    const fuelSurcharge = Math.round(freightCost * FUEL_SURCHARGE_PCT);
    const handlingFee   = HANDLING_FEE;
    const subtotal      = freightCost + fuelSurcharge + handlingFee;
    const urgentFee     = urgent ? Math.round(subtotal * (URGENT_MULTIPLIER - 1)) : 0;
    const total         = Math.round(subtotal + urgentFee);

    // Estimated transit days (simple heuristic)
    const transitDays = urgent ? 1 : Math.max(2, Math.round(chargeableWeight / 2000) + 2);

    return res.json({
      ok: true,
      data: {
        origin,
        destination,
        cargoType: cargoKey,
        weightKg,
        volumeM3,
        chargeableWeight: Math.round(chargeableWeight),
        urgent,
        breakdown: {
          freightCost:   Math.round(freightCost),
          fuelSurcharge,
          handlingFee,
          urgentFee,
          total,
        },
        currency: "ETB",
        estimatedTransitDays: transitDays,
        validForHours: 24,
        note: `Quote for ${cargoKey} cargo from ${origin} to ${destination}. Valid 24 hours.`,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

// --------------------
// Admin: messages (protected)
// --------------------
app.get("/api/admin/messages", requireAuth, requireAdmin, async (_req, res) => {
  const data = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });
  return res.json({ ok: true, data });
});

app.patch("/api/admin/messages/:id/read", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const msg = await prisma.message.update({
      where: { id },
      data: { read: true },
    });
    return res.json({ ok: true, data: msg });
  } catch {
    return res.status(404).json({ ok: false, message: "Message not found" });
  }
});

app.delete("/api/admin/messages/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.message.delete({ where: { id } });
    return res.json({ ok: true, data: deleted });
  } catch {
    return res.status(404).json({ ok: false, message: "Message not found" });
  }
});

// --------------------
// Start
// --------------------
const PORT = process.env.PORT || 5000;

async function start() {
  await prisma.$connect();
  console.log("✅ Prisma connected (Supabase/Postgres)");

  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const adminEmail = ADMIN_EMAIL.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existing) {
      const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await prisma.user.create({
        data: {
          name: "Admin",
          email: adminEmail,
          passwordHash,
          role: "ADMIN",
        },
      });
      console.log("✅ Seeded admin user:", adminEmail);
    }
  }

  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});