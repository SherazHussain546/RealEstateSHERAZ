import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  address: text("address").notNull(),
  location: jsonb("location").notNull(), // {lat: number, lng: number}
  images: text("images").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  userId: text("user_id").notNull() // Firebase user ID
});

export const viewings = pgTable("viewings", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  userId: text("user_id").notNull(),
  date: timestamp("date").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true
});

export const insertViewingSchema = createInsertSchema(viewings).omit({
  id: true,
  createdAt: true
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Viewing = typeof viewings.$inferSelect;
export type InsertViewing = z.infer<typeof insertViewingSchema>;
