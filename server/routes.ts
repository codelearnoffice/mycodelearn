// NOTE: Express Request is extended in types/express/index.d.ts so req.user is always available after authenticateToken.
import type { Express, Request, Response } from "express";
import { authenticateToken } from "./auth-middleware";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "./db";
import { earlyAccessSignups, featureUsage, insertEarlyAccessSignupSchema, userFeedback, User } from "@shared/schema";
import { eq, sql, and } from "drizzle-orm";
import { saveFeedbackToCsv } from "./feedback-csv-new";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API endpoint for early access signups
  app.post("/api/early-access", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Check if email already exists
      const [existingSignup] = await db
        .select()
        .from(earlyAccessSignups)
        .where(eq(earlyAccessSignups.email, email));
      
      if (existingSignup) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      // Store signup
      await db
        .insert(earlyAccessSignups)
        .values({ email });
      
      return res.status(201).json({ 
        message: "Thank you for signing up for early access! We'll be in touch soon." 
      });
    } catch (error) {
      console.error("Error in early access signup:", error);
      return res.status(500).json({ message: "An error occurred during signup" });
    }
  });

  // API endpoint to get signup count (for display purposes)
  app.get("/api/early-access/count", async (req, res) => {
    try {
      const [result] = await db
        .select({ count: sql<number>`count(*)` })
        .from(earlyAccessSignups);
      
      return res.json({ count: Number(result.count) });
    } catch (error) {
      console.error("Error getting signup count:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });

  // API endpoint for user feedback
  app.post("/api/feedback", async (req, res) => {
    try {
      const { name, email, feedback } = req.body;
      
      if (!name || !email || !feedback) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      
      // Store feedback in database
      await db
        .insert(userFeedback)
        .values({ name, email, feedback });
      
      // Also save to CSV file
      await saveFeedbackToCsv(name, email, feedback);
      
      return res.status(201).json({ 
        message: "Thank you for your feedback! We appreciate your input." 
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return res.status(500).json({ error: "An error occurred while submitting feedback" });
    }
  });

  // API endpoint for feature usage tracking (must be authenticated)
  app.post("/api/feature-usage/project", authenticateToken, async (req, res) => {
    console.log('POST /api/feature-usage/project headers:', req.headers);
    try {
      const userId = req.user!.id;
      const featureType = 'project';
      await storage.trackFeatureUsage(userId, featureType);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking feature usage:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });

  // API endpoint for authenticated project feature
  app.post("/api/projects", authenticateToken, async (req, res) => {
    try {
      const { title, description, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }
      const userId = req.user!.id;
  
      // Use storage.saveProject to insert into the projects table
      const project = await storage.saveProject({ userId, title, description, content });
      return res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error instanceof Error ? error.stack : error);
      return res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Update password for authenticated user
  app.post("/api/update-password", authenticateToken, async (req, res) => {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    try {
      // Get user from DB
      const [rows]: any = await storage.pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
      const user = rows[0];
      if (!user) return res.status(404).json({ error: "User not found" });
      // Compare current password
      const bcrypt = require('bcryptjs');
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return res.status(401).json({ error: "Current password is incorrect" });
      // Hash new password
      const newHash = await bcrypt.hash(newPassword, 10);
      await storage.pool.execute('UPDATE users SET password = ? WHERE id = ?', [newHash, userId]);
      return res.json({ success: true });
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "Failed to update password" });
    }
  });

  // Get all projects for an authenticated user
  // Returns: [{ id: number, title: string, description: string, content: string }]
  app.get("/api/projects", authenticateToken, async (req, res) => {
    try {
      const userId = req.user!.id;
      const projects = await storage.getUserProjects(userId);
      return res.json(projects);
    } catch (error) {
      console.error("Error getting projects:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });

  
  // Track feature usage for authenticated users only
// Expects: POST /api/feature-usage/:featureType
app.post("/api/feature-usage/:featureType", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { featureType } = req.params;
    if (!["explanation", "feedback", "project"].includes(featureType)) {
      return res.status(400).json({ error: "Invalid feature type" });
    }
    await storage.trackFeatureUsage(userId, featureType);
    res.json({ success: true });
  } catch (error) {
    console.error("Error tracking feature usage:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

// Get feature usage count for authenticated user
// Expects: GET /api/feature-usage/:featureType/count
app.get("/api/feature-usage/:featureType/count", authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.id;
    const { featureType } = req.params;
    if (!["explanation", "feedback", "project"].includes(featureType)) {
      return res.status(400).json({ error: "Invalid feature type" });
    }
    const count = await storage.getFeatureUsageCount(userId, featureType);
    return res.json({ count });
  } catch (error) {
    console.error("Error getting feature usage count:", error);
    return res.status(500).json({ error: "An error occurred" });
  }
});

const httpServer = createServer(app);
return httpServer;
}