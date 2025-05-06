import { Express } from "express";
import { z } from "zod";

// Simple in-memory store for users
let users: any[] = [];
let nextUserId = 1;

// Basic validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  profession: z.string().min(2, "Profession is required"),
  referralSource: z.string().min(2, "Referral source is required")
});

export function setupAuth(app: Express) {
  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      if (users.some(u => u.username === validatedData.username)) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      if (users.some(u => u.email === validatedData.email)) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Create new user
      const user = {
        id: nextUserId++,
        ...validatedData,
        createdAt: new Date()
      };
      
      users.push(user);

      // Return user data (excluding password)
      const { password, ...userData } = user;
      res.status(201).json(userData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = users.find(u => 
        (u.username === username || u.email === username) && u.password === password
      );

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get current user endpoint
  app.get("/api/user", (req, res) => {
    // Since we don't have sessions, we'll return a 401
    res.status(401).json({ error: "Not authenticated" });
  });
}