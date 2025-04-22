import { users, featureUsage, savedProjects, type User, type InsertUser, type FeatureUsage, type SavedProject, type InsertSavedProject } from "@shared/schema";
import { db } from "./db";
import { eq, and, isNull, sql } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

// Session store for PostgreSQL
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Feature usage tracking
  trackFeatureUsage(userId: number | null, featureType: string): Promise<void>;
  getFeatureUsageCount(userId: number | null, featureType: string): Promise<number>;
  
  // Project management
  saveProject(project: InsertSavedProject): Promise<SavedProject>;
  getUserProjects(userId: number): Promise<SavedProject[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async trackFeatureUsage(userId: number | null, featureType: string): Promise<void> {
    if (userId) {
      // For logged-in users, update their usage count
      const [existingUsage] = await db
        .select()
        .from(featureUsage)
        .where(
          and(
            eq(featureUsage.userId, userId),
            eq(featureUsage.featureType, featureType)
          )
        );
      
      if (existingUsage) {
        await db
          .update(featureUsage)
          .set({
            usageCount: existingUsage.usageCount + 1,
            lastUsedAt: new Date()
          })
          .where(eq(featureUsage.id, existingUsage.id));
      } else {
        await db
          .insert(featureUsage)
          .values({
            userId,
            featureType,
            usageCount: 1,
            lastUsedAt: new Date()
          });
      }
    } else {
      // For anonymous users, just insert with null userId
      await db
        .insert(featureUsage)
        .values({
          userId: null,
          featureType,
          usageCount: 1,
          lastUsedAt: new Date()
        });
    }
  }
  
  async getFeatureUsageCount(userId: number | null, featureType: string): Promise<number> {
    if (userId) {
      // For logged-in users, get their usage count
      const [result] = await db
        .select({
          count: sql<number>`sum(${featureUsage.usageCount})`
        })
        .from(featureUsage)
        .where(
          and(
            eq(featureUsage.userId, userId),
            eq(featureUsage.featureType, featureType)
          )
        );
      
      return result?.count || 0;
    } else {
      // For anonymous users, count all anonymous usage with the IP
      const [result] = await db
        .select({
          count: sql<number>`count(*)`
        })
        .from(featureUsage)
        .where(
          and(
            isNull(featureUsage.userId),
            eq(featureUsage.featureType, featureType)
          )
        );
      
      return result?.count || 0;
    }
  }
  
  async saveProject(project: InsertSavedProject): Promise<SavedProject> {
    const [savedProject] = await db
      .insert(savedProjects)
      .values(project)
      .returning();
    
    return savedProject;
  }
  
  async getUserProjects(userId: number): Promise<SavedProject[]> {
    return db
      .select()
      .from(savedProjects)
      .where(eq(savedProjects.userId, userId))
      .orderBy(sql`${savedProjects.createdAt} DESC`);
  }
}

export const storage = new DatabaseStorage();
