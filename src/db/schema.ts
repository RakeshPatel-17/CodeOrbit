import { pgTable, text, timestamp, integer, boolean, json, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  role: text("role").default("volunteer").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const donors = pgTable("donors", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorCode: text("donor_code").unique().notNull(),
  fullName: text("full_name").notNull(),
  address: text("address"),
  area: text("area"),
  mobileNumber: text("mobile_number"),
  status: text("status").default("active"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
  modifiedAt: timestamp("modified_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  donorId: uuid("donor_id").references(() => donors.id).notNull(),
  amount: integer("amount").notNull(),
  months: json("months").notNull(), // Array of strings e.g. ["2023-01", "2023-02"]
  paymentMode: text("payment_mode").notNull(), // Cash, UPI, Online Transfer, Cheque
  referenceNumber: text("reference_number"),
  remarks: text("remarks"),
  status: text("status").default("active"), // active or voided
  voidReason: text("void_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by").notNull(), // Clerk User ID
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(),
  module: text("module").notNull(),
  oldValue: json("old_value"),
  newValue: json("new_value"),
  ipAddress: text("ip_address"),
  browser: text("browser"),
  createdAt: timestamp("created_at").defaultNow(),
});
