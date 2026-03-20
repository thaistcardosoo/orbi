import { pgTable, text, integer, boolean, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  coverImage: text("cover_image"),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  size: text("size").notNull(),
  foundedYear: integer("founded_year"),
  employeeCount: integer("employee_count"),
  averageAge: integer("average_age"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  website: text("website"),
  linkedin: text("linkedin"),
  instagram: text("instagram"),
  featured: boolean("featured").default(false).notNull(),
  benefits: text("benefits").array().default([]).notNull(),
  values: text("values").array().default([]).notNull(),
  photos: text("photos").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companiesTable.$inferSelect;
