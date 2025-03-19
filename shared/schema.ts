import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  address: text("address").notNull(),
  location: jsonb("location").notNull(),
  images: text("images").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").notNull().references(() => users.id)
});

export const viewings = pgTable("viewings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull().references(() => properties.id),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users).extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true
});

export const insertViewingSchema = createInsertSchema(viewings).omit({
  id: true,
  createdAt: true
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Viewing = typeof viewings.$inferSelect;
export type InsertViewing = z.infer<typeof insertViewingSchema>;