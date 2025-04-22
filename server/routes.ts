import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

interface EarlyAccessSignup {
  email: string;
}

// Store early access signups in memory
const earlyAccessSignups: EarlyAccessSignup[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
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
      const existingSignup = earlyAccessSignups.find(signup => signup.email === email);
      if (existingSignup) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      // Store signup
      earlyAccessSignups.push({ email });
      
      return res.status(201).json({ 
        message: "Thank you for signing up for early access! We'll be in touch soon." 
      });
    } catch (error) {
      console.error("Error in early access signup:", error);
      return res.status(500).json({ message: "An error occurred during signup" });
    }
  });

  // API endpoint to get signup count (for display purposes)
  app.get("/api/early-access/count", (req, res) => {
    return res.json({ count: earlyAccessSignups.length });
  });

  const httpServer = createServer(app);
  return httpServer;
}
