import { Hono } from "hono";
import { handle } from "hono/vercel";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { db } from "../src/db";
import { donors, donations, auditLogs } from "../src/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono().basePath("/api");

app.use("*", clerkMiddleware());

// Middleware to check authentication
app.use("*", async (c, next) => {
  const auth = getAuth(c);
  if (!auth?.userId) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

// Create an audit log
const logAudit = async (userId: string, action: string, module: string, oldValue: unknown, newValue: unknown) => {
  await db.insert(auditLogs).values({
    userId, action, module, oldValue, newValue
  });
};

// === DONORS ===
app.get("/donors", async (c) => {
  const query = c.req.query("q") || "";
  let conditions = undefined;
  if (query) {
    conditions = sql`${donors.fullName} ILIKE ${`%${query}%`} OR ${donors.donorCode} ILIKE ${`%${query}%`} OR ${donors.mobileNumber} ILIKE ${`%${query}%`}`;
  }
  const result = await db.select().from(donors).where(conditions).orderBy(desc(donors.createdAt)).limit(50);
  return c.json(result);
});

app.post("/donors", zValidator("json", z.object({
  fullName: z.string().min(1),
  address: z.string().optional(),
  area: z.string().optional(),
  mobileNumber: z.string().optional(),
  remarks: z.string().optional()
})), async (c) => {
  const data = c.req.valid("json");
  const auth = getAuth(c);
  if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);
  
  // Auto-generate donor code
  const countRes = await db.select({ count: sql<number>`count(*)` }).from(donors);
  const nextNum = Number(countRes[0]?.count || 0) + 1;
  const donorCode = `BAPS-${nextNum.toString().padStart(4, "0")}`;

  const [newDonor] = await db.insert(donors).values({
    ...data,
    donorCode,
  }).returning();

  await logAudit(auth.userId, "CREATE", "Donors", null, newDonor);
  return c.json(newDonor);
});

// === DONATIONS ===
app.post("/donations", zValidator("json", z.object({
  donorId: z.string().uuid(),
  amount: z.number().positive(),
  months: z.array(z.string()).min(1),
  paymentMode: z.string(),
  referenceNumber: z.string().optional(),
  remarks: z.string().optional()
})), async (c) => {
  const data = c.req.valid("json");
  const auth = getAuth(c);
  if (!auth?.userId) return c.json({ error: "Unauthorized" }, 401);

  const [newDonation] = await db.insert(donations).values({
    ...data,
    createdBy: auth.userId,
  }).returning();

  await logAudit(auth.userId, "CREATE", "Donations", null, newDonation);
  return c.json(newDonation);
});

app.get("/donations", async (c) => {
  const result = await db.select({
    id: donations.id,
    amount: donations.amount,
    months: donations.months,
    paymentMode: donations.paymentMode,
    createdAt: donations.createdAt,
    status: donations.status,
    donorName: donors.fullName,
    donorCode: donors.donorCode
  })
  .from(donations)
  .leftJoin(donors, eq(donations.donorId, donors.id))
  .orderBy(desc(donations.createdAt))
  .limit(100);

  return c.json(result);
});

// === DASHBOARD ===
app.get("/dashboard", async (c) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todaysCollection] = await db.select({ total: sql<number>`sum(${donations.amount})` })
    .from(donations)
    .where(sql`${donations.createdAt} >= ${today.toISOString()} AND ${donations.status} = 'active'`);

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const [monthlyCollection] = await db.select({ total: sql<number>`sum(${donations.amount})` })
    .from(donations)
    .where(sql`${donations.createdAt} >= ${currentMonthStart.toISOString()} AND ${donations.status} = 'active'`);

  const [totalDonors] = await db.select({ count: sql<number>`count(*)` }).from(donors);

  return c.json({
    todaysCollection: Number(todaysCollection?.total || 0),
    monthlyCollection: Number(monthlyCollection?.total || 0),
    totalDonors: Number(totalDonors?.count || 0)
  });
});

export default handle(app);
