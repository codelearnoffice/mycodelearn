import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  profession: text("profession").notNull(),
  referralSource: text("referral_source").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Early access signups table
export const earlyAccessSignups = pgTable("early_access_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Feature usage tracking table
export const featureUsage = pgTable("feature_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  featureType: text("feature_type").notNull(), // 'explanation', 'feedback', 'project'
  usageCount: integer("usage_count").notNull().default(1),
  lastUsedAt: timestamp("last_used_at").defaultNow().notNull(),
});

// Saved projects table
export const savedProjects = pgTable("saved_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  phoneNumber: true,
  profession: true,
  referralSource: true,
});

export const insertEarlyAccessSignupSchema = createInsertSchema(earlyAccessSignups).pick({
  email: true,
});

export const insertFeatureUsageSchema = createInsertSchema(featureUsage).pick({
  userId: true,
  featureType: true,
});

export const insertSavedProjectSchema = createInsertSchema(savedProjects).pick({
  userId: true,
  title: true,
  description: true,
  content: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEarlyAccessSignup = z.infer<typeof insertEarlyAccessSignupSchema>;
export type EarlyAccessSignup = typeof earlyAccessSignups.$inferSelect;

export type InsertFeatureUsage = z.infer<typeof insertFeatureUsageSchema>;
export type FeatureUsage = typeof featureUsage.$inferSelect;

export type InsertSavedProject = z.infer<typeof insertSavedProjectSchema>;
export type SavedProject = typeof savedProjects.$inferSelect;
