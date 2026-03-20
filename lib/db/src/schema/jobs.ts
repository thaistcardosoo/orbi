import { pgTable, text, integer, boolean, timestamp, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { companiesTable } from "./companies";

export type FaqItem = { question: string; answer: string };

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  companyId: integer("company_id").references(() => companiesTable.id).notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  requirements: text("requirements").array().default([]).notNull(),
  benefits: text("benefits").array().default([]).notNull(),
  faq: jsonb("faq").$type<FaqItem[]>(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  modality: text("modality").notNull(),
  contractType: text("contract_type").notNull(),
  level: text("level").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ id: true, createdAt: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;
