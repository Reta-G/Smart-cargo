import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Known plain-text passwords (for local dev) ───────────────────────────────
// Admin:    admin@smartcargo.com   / Admin@123456
// driver:   jacob@gmail.com        /Jacob@12
// Driver:   driver@driver.com      / Driver@123456
// Driver2:  driver1@smartcargo.com / Driver@123456
// Customer: tofik@gmail.com        / Customer@123456
// Customer: abe@12                 / Customer@123456

async function hash(pw) {
  return bcrypt.hash(pw, 10);
}

async function main() {
  console.log("🌱 Seeding database...");

  const adminHash    = await hash("Admin@123456");
  const driverHash   = await hash("Driver@123456");
  const customerHash = await hash("Customer@123456");

  // ── Users ──────────────────────────────────────────────────────────────────
  const users = [
    // ADMIN
    { id: "cmo1rkwbf0001vf68nhcejvf1", name: "Admin",     email: "admin@smartcargo.com",  passwordHash: adminHash,    role: "ADMIN",    status: "ACTIVE" },

    // DRIVERS
    { id: "cmo4eey530002vf5kq41bq64l", name: "Driver One",email: "driver1@smartcargo.com",passwordHash: driverHash,   role: "DRIVER",   status: "ACTIVE" },
    { id: "cmo6tb40k0000vfdwurh2nh4v", name: "aaaa",      email: "aaaa@a",                passwordHash: driverHash,   role: "DRIVER",   status: "ACTIVE" },
    { id: "cmo76zcow0000vfpk456hxhq6", name: "dr",        email: "dr@12",                 passwordHash: driverHash,   role: "DRIVER",   status: "ACTIVE" },
    { id: "cmo9tf4cw0000vfysbys7tcfz", name: "driver 1",  email: "driver@driver.com",     passwordHash: driverHash,   role: "DRIVER",   status: "ACTIVE" },

    // CUSTOMERS
    { id: "cmo1yduid0000vf5c5dno0eux", name: "tewfik",    email: "tofik@gmail.com",       passwordHash: customerHash, role: "CUSTOMER", status: "ACTIVE" },
    { id: "cmo4pj7ls0002vf0896ompsyk", name: "dddd",      email: "zxsxs@sszw",            passwordHash: customerHash, role: "CUSTOMER", status: "ACTIVE" },
    { id: "cmo5hk6yn0001vffkulwc8ooo", name: "cdx",       email: "sw2sw@w",               passwordHash: customerHash, role: "CUSTOMER", status: "ACTIVE" },
    { id: "cmo6tuxtj0001vfdwzrh56srs", name: "aaaa",      email: "aaaa@aa",               passwordHash: customerHash, role: "CUSTOMER", status: "ACTIVE" },
    { id: "cmo9tnktb0000vfu4bm2sdqhx", name: "abe",       email: "abe@12",                passwordHash: customerHash, role: "CUSTOMER", status: "ACTIVE" },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: { passwordHash: u.passwordHash }, // refresh hash on re-seed
      create: u,
    });
  }
  console.log(`  ✔ ${users.length} users`);

  // ── Vehicles ───────────────────────────────────────────────────────────────
  const vehicles = [
    {
      id: "cmo6vevza0002vfrgk1yg11us",
      vehicleNo: "TRK-001",
      type: "Semi-Trailer",
      status: "AVAILABLE",
      driverName: "aaaa",
      lastSeen: "Just now",
      driverId: "cmo6tb40k0000vfdwurh2nh4v",
    },
  ];

  for (const v of vehicles) {
    await prisma.vehicle.upsert({ where: { id: v.id }, update: {}, create: v });
  }
  console.log(`  ✔ ${vehicles.length} vehicles`);

  // ── Shipments ──────────────────────────────────────────────────────────────
  const shipments = [
    {
      id: "cmo5hk6yn0001vffkulwc8ooo_shp",
      shipmentNo: "SHP-0001",
      client: "Test Client",
      origin: "Berlin",
      destination: "Munich",
      status: "DELIVERED",
      eta: "Tomorrow",
      driverName: "Driver One",
      driverId: "cmo4eey530002vf5kq41bq64l",
      customerId: "cmo5hk6yn0001vffkulwc8ooo",
      vehicleId: "cmo6vevza0002vfrgk1yg11us",
    },
    {
      id: "cmo68xkcd0003vf2ow4ns9ydr",
      shipmentNo: "SHP-846592F4",
      client: "dddd",
      origin: "Addis Ababa",
      destination: "Djibouti",
      status: "IN_TRANSIT",
      eta: null,
      driverName: "aaaa",
      driverId: "cmo6tb40k0000vfdwurh2nh4v",
      customerId: "cmo4pj7ls0002vf0896ompsyk",
      currentLat: 9.03,
      currentLng: 38.74,
      vehicleId: "cmo6vevza0002vfrgk1yg11us",
    },
    {
      id: "cmo69axo00009vf2o2rmoqhz1",
      shipmentNo: "SHP-702EB046",
      client: "dddd",
      origin: "Nairobi",
      destination: "Mombasa",
      status: "DELIVERED",
      eta: null,
      driverName: "dr",
      driverId: "cmo76zcow0000vfpk456hxhq6",
      customerId: "cmo4pj7ls0002vf0896ompsyk",
      currentLat: 11.596464,
      currentLng: 37.40044,
      vehicleId: "cmo6vevza0002vfrgk1yg11us",
    },
    {
      id: "cmo6tydat0005vfdw0azz5ej7",
      shipmentNo: "SHP-DF7DAE6A",
      client: "aaaa",
      origin: "Addis Ababa",
      destination: "Dubai",
      status: "PENDING",
      eta: null,
      driverName: "aaaa",
      driverId: "cmo6tb40k0000vfdwurh2nh4v",
      customerId: "cmo6tuxtj0001vfdwzrh56srs",
      currentLat: 45.5,
      currentLng: 12.5,
      vehicleId: "cmo6vevza0002vfrgk1yg11us",
    },
    {
      id: "cmo9twfuz0004vfu4d8yfuqxt",
      shipmentNo: "SHP-589E5581",
      client: "abe",
      origin: "Bahir Dar",
      destination: "Cairo",
      status: "DELIVERED",
      eta: null,
      driverName: "driver 1",
      driverId: "cmo9tf4cw0000vfysbys7tcfz",
      customerId: "cmo9tnktb0000vfu4bm2sdqhx",
      currentLat: 52.4,
      currentLng: 13.4,
      vehicleId: "cmo6vevza0002vfrgk1yg11us",
    },
  ];

  for (const s of shipments) {
    await prisma.shipment.upsert({ where: { shipmentNo: s.shipmentNo }, update: {}, create: s });
  }
  console.log(`  ✔ ${shipments.length} shipments`);

  // ── ShipmentRequests ───────────────────────────────────────────────────────
  const requests = [
    { id: "cmo5kbhur0001vff4wbn2jcmt", requestNo: "REQ-7B3A2120", origin: "Berlin",       destination: "Munich",   cargoType: "Boxes",    weightKg: 120,   notes: "Handle with care",   status: "NEW",      customerId: "cmo5hk6yn0001vffkulwc8ooo" },
    { id: "cmo5kycrt0003vff46tzyooj4", requestNo: "REQ-A263BB47", origin: "Addis Ababa",   destination: "Nairobi", cargoType: "Electronics", weightKg: null, notes: "Fragile",           status: "REJECTED", customerId: "cmo5hk6yn0001vffkulwc8ooo" },
    { id: "cmo68dcvs0001vfrcvb7ba4ey", requestNo: "REQ-7769D0FE", origin: "Djibouti",      destination: "Dubai",   cargoType: "Machinery",weightKg: 1123,  notes: "Heavy load",         status: "APPROVED", customerId: "cmo4pj7ls0002vf0896ompsyk" },
    { id: "cmo68wy720001vf2odnvepssa", requestNo: "REQ-846592F4", origin: "Addis Ababa",   destination: "Djibouti",cargoType: "Textiles", weightKg: 1111,  notes: "Urgent",             status: "APPROVED", customerId: "cmo4pj7ls0002vf0896ompsyk" },
    { id: "cmo69987j0005vf2o92wh0pz8", requestNo: "REQ-F5485950", origin: "Nairobi",       destination: "Cairo",   cargoType: "Food",     weightKg: 500,   notes: "Keep refrigerated",  status: "REJECTED", customerId: "cmo4pj7ls0002vf0896ompsyk" },
    { id: "cmo69ahdf0007vf2ohhu97m9i", requestNo: "REQ-702EB046", origin: "Nairobi",       destination: "Mombasa", cargoType: "Chemicals",weightKg: 333,   notes: "Hazardous",          status: "APPROVED", customerId: "cmo4pj7ls0002vf0896ompsyk" },
    { id: "cmo6tw1xn0003vfdwu8xjiz4k", requestNo: "REQ-DF7DAE6A", origin: "Addis Ababa",  destination: "Dubai",   cargoType: "Car Parts",weightKg: 1000,  notes: "Deliver on time",    status: "APPROVED", customerId: "cmo6tuxtj0001vfdwzrh56srs" },
    { id: "cmo9tuxbi0002vfu4lkngbv5p", requestNo: "REQ-589E5581", origin: "Bahir Dar",     destination: "Cairo",   cargoType: "Grain",    weightKg: 100,   notes: "Handle carefully",   status: "APPROVED", customerId: "cmo9tnktb0000vfu4bm2sdqhx" },
  ];

  for (const r of requests) {
    await prisma.shipmentRequest.upsert({ where: { requestNo: r.requestNo }, update: {}, create: r });
  }
  console.log(`  ✔ ${requests.length} shipment requests`);

  // ── Messages ───────────────────────────────────────────────────────────────
  const messages = [
    { id: "cmnwzl18t0002vfzkucjodlat", name: "tofik ahmed",  email: "tewfika823@gmail.com",     subject: "Looking for cargo service", message: "I need to ship goods from Berlin to Munich.", read: false },
    { id: "cmo1rmmje0002vf684vp16n9m", name: "Tewfik Ahmed", email: "tewemn123@gmail.com",       subject: "Shipment inquiry",          message: "What are your rates for heavy cargo?",        read: false },
    { id: "cmo1u5ggj0000vfy4gzcvkom0", name: "Tewfik Ahmed", email: "tofikahmed67890@gmail.com", subject: "Tracking issue",            message: "My shipment SHP-0001 is not updating.",       read: false },
    { id: "cmo1u5mep0001vfy49iyf2rcj", name: "tofik ahmed",  email: "tewfika823@gmail.com",      subject: "Delivery confirmation",     message: "Please confirm delivery to Munich.",          read: true  },
    { id: "cmo1u5rjv0002vfy4axueeciw", name: "Customer C",   email: "dckcdmjd@gmail.com",        subject: "Shipment inquiry",          message: "Do you ship to Dubai?",                       read: false },
    { id: "cmo1u5xds0003vfy4s5cqv8be", name: "Customer D",   email: "tofikahmed67890@gmail.com", subject: "Delivery confirmation",     message: "Goods received in good condition.",           read: false },
    { id: "cmo1u62ds0004vfy4kovgh7z1", name: "Customer E",   email: "dckcdmjd@gmail.com",        subject: "General inquiry",           message: "What documents are needed for customs?",      read: false },
  ];

  for (const m of messages) {
    await prisma.message.upsert({ where: { id: m.id }, update: {}, create: m });
  }
  console.log(`  ✔ ${messages.length} messages`);

  console.log("\n✅ Seed complete. Login credentials:");
  console.log("   ADMIN    → admin@smartcargo.com   / Admin@123456");
  console.log("   DRIVER   → driver@driver.com      / Driver@123456");
  console.log("   DRIVER   → driver1@smartcargo.com / Driver@123456");
  console.log("   CUSTOMER → tofik@gmail.com        / Customer@123456");
  console.log("   CUSTOMER → abe@12                 / Customer@123456");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
