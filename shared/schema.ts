import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phoneNumber: text("phone_number").notNull(),
  profession: text("profession").notNull(),
  referralSource: text("referral_source").notNull(),
  createdAt: integer("created_at").notNull(),
});

// Early access signups table
export const earlyAccessSignups = sqliteTable("early_access_signups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at").notNull(),
});

// Feature usage tracking table
export const featureUsage = sqliteTable("feature_usage", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  featureType: text("feature_type").notNull(), // 'explanation', 'feedback', 'project'
  usageCount: integer("usage_count").notNull().default(1),
  lastUsedAt: integer("last_used_at").notNull(),
});

// Saved projects table
export const savedProjects = sqliteTable("saved_projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
});

// User feedback table
export const userFeedback = sqliteTable("user_feedback", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  feedback: text("feedback").notNull(),
  createdAt: integer("created_at").notNull(),
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

export const insertUserFeedbackSchema = createInsertSchema(userFeedback).pick({
  name: true,
  email: true,
  feedback: true,
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

export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;
export type UserFeedback = typeof userFeedback.$inferSelect;
