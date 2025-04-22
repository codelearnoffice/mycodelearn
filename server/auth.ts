import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as UserType, insertUserSchema } from "@shared/schema";
import { z } from "zod";

declare global {
  namespace Express {
    // Use UserType, not recursively referencing User
    interface User extends UserType {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Extended schema with additional fields
const registerUserSchema = insertUserSchema.extend({
  fullName: z.string().min(2, "Full name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  profession: z.string().min(2, "Profession is required"),
  referralSource: z.string().min(2, "Referral source is required")
});

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false, 
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if it's a username or email
        let user;
        if (username.includes('@')) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate request body
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Create user with hashed password
      const user = await storage.createUser({
        ...validatedData,
        password: await hashPassword(validatedData.password),
      });

      // Log user in
      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json({ 
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profession: user.profession
        });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json({ 
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profession: user.profession
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const user = req.user as User;
    res.json({ 
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      profession: user.profession
    });
  });

  // Feature usage endpoints
  app.post("/api/track-usage", async (req, res, next) => {
    try {
      const { featureType } = req.body;
      
      if (!featureType || !["explanation", "feedback", "project"].includes(featureType)) {
        return res.status(400).json({ error: "Invalid feature type" });
      }
      
      const userId = req.isAuthenticated() ? (req.user as User).id : null;
      
      await storage.trackFeatureUsage(userId, featureType);
      
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/feature-usage/:type", async (req, res, next) => {
    try {
      const featureType = req.params.type;
      
      if (!featureType || !["explanation", "feedback", "project"].includes(featureType)) {
        return res.status(400).json({ error: "Invalid feature type" });
      }
      
      const userId = req.isAuthenticated() ? (req.user as User).id : null;
      
      const count = await storage.getFeatureUsageCount(userId, featureType);
      
      res.json({ count });
    } catch (error) {
      next(error);
    }
  });
  
  // Saved projects endpoints
  app.post("/api/save-project", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const { title, description, content } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: "Title and content are required" });
      }
      
      const userId = (req.user as User).id;
      
      const savedProject = await storage.saveProject({
        userId,
        title,
        description: description || "",
        content
      });
      
      res.status(201).json(savedProject);
    } catch (error) {
      next(error);
    }
  });
  
  app.get("/api/projects", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const userId = (req.user as User).id;
      
      const projects = await storage.getUserProjects(userId);
      
      res.json(projects);
    } catch (error) {
      next(error);
    }
  });
}