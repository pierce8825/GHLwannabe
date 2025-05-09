import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
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
  parentId: integer("parent_id"), // Reference to parent user for subaccounts
  companyName: text("company_name"), // Company name for main account and subaccounts
  isSubaccount: boolean("is_subaccount").default(false).notNull(), // Flag to identify subaccounts
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
  avatarUrl: true,
  parentId: true,
  companyName: true,
  isSubaccount: true,
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

// Funnels Schema
export const funnels = pgTable("funnels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("draft").notNull(), // draft, active, archived
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFunnelSchema = createInsertSchema(funnels).pick({
  name: true,
  description: true,
  status: true,
  userId: true,
});

// Funnel Steps Schema
export const funnelSteps = pgTable("funnel_steps", {
  id: serial("id").primaryKey(),
  funnelId: integer("funnel_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // landing, form, thank-you, upsell, etc.
  order: integer("order").notNull(),
  content: jsonb("content"), // The structure of the page content
  settings: jsonb("settings"), // Background, SEO settings, etc.
  slug: text("slug"), // URL slug for the step
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFunnelStepSchema = createInsertSchema(funnelSteps).pick({
  funnelId: true,
  title: true,
  type: true,
  order: true,
  content: true,
  settings: true,
  slug: true,
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type Funnel = typeof funnels.$inferSelect;
export type InsertFunnel = z.infer<typeof insertFunnelSchema>;

export type FunnelStep = typeof funnelSteps.$inferSelect;
export type InsertFunnelStep = z.infer<typeof insertFunnelStepSchema>;

// Define relations between tables
export const usersRelations = relations(users, ({ many, one }) => ({
  tasks: many(tasks, { relationName: "user_tasks" }),
  activities: many(activities, { relationName: "user_activities" }),
  subaccounts: many(users, { relationName: "parent_subaccounts" }),
  funnels: many(funnels, { relationName: "user_funnels" }),
  parent: one(users, {
    fields: [users.parentId],
    references: [users.id],
    relationName: "parent_subaccounts",
  }),
}));

export const contactsRelations = relations(contacts, ({ many }) => ({
  deals: many(deals, { relationName: "contact_deals" }),
  tasks: many(tasks, { relationName: "contact_tasks" }),
  activities: many(activities, { relationName: "contact_activities" }),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [deals.contactId],
    references: [contacts.id],
    relationName: "deal_contact",
  }),
  tasks: many(tasks, { relationName: "deal_tasks" }),
  activities: many(activities, { relationName: "deal_activities" }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  contact: one(contacts, {
    fields: [tasks.contactId],
    references: [contacts.id],
    relationName: "task_contact",
  }),
  deal: one(deals, {
    fields: [tasks.dealId],
    references: [deals.id],
    relationName: "task_deal",
  }),
  assignedUser: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: "user_tasks",
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  contact: one(contacts, {
    fields: [activities.contactId],
    references: [contacts.id],
    relationName: "contact_activities",
  }),
  deal: one(deals, {
    fields: [activities.dealId],
    references: [deals.id],
    relationName: "deal_activities",
  }),
  createdByUser: one(users, {
    fields: [activities.createdBy],
    references: [users.id],
    relationName: "user_activities",
  }),
}));

// Funnel and Funnel Steps relations
export const funnelsRelations = relations(funnels, ({ one, many }) => ({
  user: one(users, {
    fields: [funnels.userId],
    references: [users.id],
    relationName: "user_funnels",
  }),
  steps: many(funnelSteps, { relationName: "funnel_steps" }),
}));

export const funnelStepsRelations = relations(funnelSteps, ({ one }) => ({
  funnel: one(funnels, {
    fields: [funnelSteps.funnelId],
    references: [funnels.id],
    relationName: "funnel_steps",
  }),
}));
