import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { db } from "./db";
import { earlyAccessSignups, featureUsage, insertEarlyAccessSignupSchema, userFeedback, User } from "@shared/schema";
import { eq, sql, and } from "drizzle-orm";
import { saveFeedbackToXml } from "./feedback-xml";

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
      
      // Also save to XML file
      await saveFeedbackToXml(name, email, feedback);
      
      return res.status(201).json({ 
        message: "Thank you for your feedback! We appreciate your input." 
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return res.status(500).json({ error: "An error occurred while submitting feedback" });
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
  
  // Save a project idea for an authenticated user
  app.post("/api/projects", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const { title, description, content } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }
      
      // Save the project
      const project = await storage.saveProject({
        userId: req.user.id,
        title,
        description: description || "",
        content
      });
      
      return res.status(201).json(project);
    } catch (error) {
      console.error("Error saving project:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
  
  // Get all projects for an authenticated user
  app.get("/api/projects", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      // Get the user's projects
      const projects = await storage.getUserProjects(req.user.id);
      
      return res.json(projects);
    } catch (error) {
      console.error("Error getting projects:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
  
  // Track feature usage
  app.post("/api/feature-usage/:featureType", async (req, res) => {
    try {
      const { featureType } = req.params;
      const userId = req.isAuthenticated() ? req.user.id : null;
      
      // Validate feature type
      if (!["explanation", "feedback", "project"].includes(featureType)) {
        return res.status(400).json({ error: "Invalid feature type" });
      }
      
      // Track usage
      await storage.trackFeatureUsage(userId, featureType);
      
      return res.status(201).json({ message: "Usage tracked successfully" });
    } catch (error) {
      console.error("Error tracking feature usage:", error);
      return res.status(500).json({ error: "An error occurred" });
    }
  });
  
  // Get feature usage count
  app.get("/api/feature-usage/:featureType/count", async (req, res) => {
    try {
      const { featureType } = req.params;
      const userId = req.isAuthenticated() ? req.user.id : null;
      
      // Validate feature type
      if (!["explanation", "feedback", "project"].includes(featureType)) {
        return res.status(400).json({ error: "Invalid feature type" });
      }
      
      // Get count
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