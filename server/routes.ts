import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "./db";
import { earlyAccessSignups, insertEarlyAccessSignupSchema } from "@shared/schema";
import { eq } from "drizzle-orm";

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
        .select({ count: db.fn.count() })
        .from(earlyAccessSignups);
      
      return res.json({ count: Number(result.count) });
    } catch (error) {
      console.error("Error getting signup count:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });

  // API endpoints for features
  app.post("/api/code-explanation", async (req, res) => {
    try {
      const { code, programmingLanguage, explanationLanguage, explanationTone } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }
      
      const userId = req.isAuthenticated() ? req.user.id : null;
      const featureType = "explanation";
      
      // Check usage limits for non-authenticated users
      if (!userId) {
        const count = await storage.getFeatureUsageCount(null, featureType);
        if (count >= 3) {
          return res.status(403).json({ 
            error: "Free usage limit exceeded", 
            message: "Please create an account to continue using this feature"
          });
        }
      }
      
      // For now, just pass through the request and record usage
      // In a real implementation, this would call an AI service
      await storage.trackFeatureUsage(userId, featureType);
      
      // Mock response
      const explanation = `This is a sample explanation for ${programmingLanguage} code. 
      In a real implementation, we would call an AI service to generate the explanation.`;
      
      return res.json({ explanation });
    } catch (error) {
      console.error("Error in code explanation:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
  
  app.post("/api/code-feedback", async (req, res) => {
    try {
      const { code, programmingLanguage } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }
      
      const userId = req.isAuthenticated() ? req.user.id : null;
      const featureType = "feedback";
      
      // Check usage limits for non-authenticated users
      if (!userId) {
        const count = await storage.getFeatureUsageCount(null, featureType);
        if (count >= 3) {
          return res.status(403).json({ 
            error: "Free usage limit exceeded", 
            message: "Please create an account to continue using this feature"
          });
        }
      }
      
      // For now, just pass through the request and record usage
      await storage.trackFeatureUsage(userId, featureType);
      
      // Mock response
      const feedback = `This is sample feedback for ${programmingLanguage} code. 
      In a real implementation, we would call an AI service to analyze the code.`;
      
      return res.json({ feedback });
    } catch (error) {
      console.error("Error in code feedback:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
  
  app.post("/api/project-ideas", async (req, res) => {
    try {
      const { skillLevel, programmingLanguage, interestArea, additionalInterests } = req.body;
      
      if (!skillLevel || !programmingLanguage || !interestArea) {
        return res.status(400).json({ error: "Required fields missing" });
      }
      
      const userId = req.isAuthenticated() ? req.user.id : null;
      const featureType = "project";
      
      // Check usage limits for non-authenticated users
      if (!userId) {
        const count = await storage.getFeatureUsageCount(null, featureType);
        if (count >= 3) {
          return res.status(403).json({ 
            error: "Free usage limit exceeded", 
            message: "Please create an account to continue using this feature"
          });
        }
      }
      
      // For now, just pass through the request and record usage
      await storage.trackFeatureUsage(userId, featureType);
      
      // Mock response
      const projectIdea = `This is a sample project idea for a ${skillLevel} programmer using ${programmingLanguage} interested in ${interestArea}.
      Additional interests: ${additionalInterests || 'None'}.
      In a real implementation, we would call an AI service to generate a detailed project idea.`;
      
      return res.json({ projectIdea });
    } catch (error) {
      console.error("Error in project idea generation:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
