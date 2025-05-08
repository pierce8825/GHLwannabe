import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").default("user").notNull(),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  avatarUrl: true,
});

// Contacts Schema
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  status: text("status").default("lead").notNull(), // lead, customer, prospect, etc.
  source: text("source"), // where this contact came from
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  status: true,
  source: true,
  notes: true,
});

// Deals Schema
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  contactId: integer("contact_id").notNull(),
  amount: integer("amount"),
  stage: text("stage").notNull(), // lead, qualified, proposal, negotiation, won, lost
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertDealSchema = createInsertSchema(deals).pick({
  title: true,
  contactId: true,
  amount: true,
  stage: true,
  description: true,
});

// Tasks Schema
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  contactId: integer("contact_id"),
  dealId: integer("deal_id"),
  assignedTo: integer("assigned_to"), // user id
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  dueDate: true,
  contactId: true,
  dealId: true,
  assignedTo: true,
  completed: true,
});

// Activities Schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // email, call, meeting, note, etc.
  title: text("title").notNull(),
  description: text("description"),
  contactId: integer("contact_id"),
  dealId: integer("deal_id"),
  createdBy: integer("created_by").notNull(), // user id
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  type: true,
  title: true,
  description: true,
  contactId: true,
  dealId: true,
  createdBy: true,
});

// Campaigns Schema
export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // email, sms, etc.
  status: text("status").default("draft").notNull(), // draft, active, completed, paused
  subject: text("subject"),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  scheduledAt: timestamp("scheduled_at"),
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  name: true,
  type: true,
  status: true,
  subject: true,
  content: true,
  scheduledAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
