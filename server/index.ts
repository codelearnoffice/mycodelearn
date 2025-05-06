import { pool } from './db'; // Make sure this import is at the top
import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import { AuthService } from './auth-service';
import { initDb } from './db';
import cookieParser from "cookie-parser";
// Initialize the database
initDb().then(() => {
  log('MySQL database initialized successfully');
}).catch(err => {
  console.error('Error initializing MySQL database:', err);
  process.exit(1);
});

const app = express();
app.use(cookieParser());

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'], // Allow both Vite dev server and production server
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Authentication middleware
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  // Log all headers and cookies for debugging
  console.log('Incoming request headers:', req.headers);
  console.log('Incoming cookies:', req.cookies);
  try {
    let token: string | undefined;
    // Try Authorization header first
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Fallback to httpOnly cookie
      token = req.cookies.token;
    }
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    const decoded = AuthService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    const user = await AuthService.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Register endpoint
app.post("/api/auth/register", async (req, res) => {
  try {
    const userData = req.body;
    const result = await AuthService.registerUser(userData);
    
    // Set token in cookie for added security
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json(result);
  } catch (error: any) {
    console.error("Registration error:", error);
    
    if (error.message === 'Username already exists' || error.message === 'Email already exists') {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
});

// Login endpoint
app.post("/api/auth/login", async (req, res) => {
  try {
    const loginData = req.body;
    const result = await AuthService.loginUser(loginData);
    
    // Set token in cookie for added security
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(200).json(result);
  } catch (error: any) {
    console.error("Login error:", error);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: error.errors 
      });
    }
    
    res.status(500).json({ error: "Login failed. Please try again later." });
  }
});

// Get current user endpoint
app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json((req as any).user); // Send user object directly
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
});

// Middleware to log API requests
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Don't log sensitive data
      if (capturedJsonResponse && !path.includes('/auth/')) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      } else if (capturedJsonResponse) {
        logLine += ` :: [Auth response]`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Fix for the error messages in generate buttons
app.post("/api/generate/explanation", (req, res) => {
  try {
    // Mock successful response
    setTimeout(() => {
      res.json({
        completion: "This is a sample explanation. In a real implementation, this would be generated by an AI model."
      });
    }, 1000);
  } catch (error) {
    console.error("Error generating explanation:", error);
    res.status(500).json({ error: "Failed to generate explanation" });
  }
});

app.post("/api/generate/feedback", (req, res) => {
  try {
    // Mock successful response
    setTimeout(() => {
      res.json({
        completion: "This is a sample feedback. In a real implementation, this would be generated by an AI model."
      });
    }, 1000);
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

app.post("/api/generate/project", (req, res) => {
  try {
    // Mock successful response
    setTimeout(() => {
      res.json({
        completion: "This is a sample project idea. In a real implementation, this would be generated by an AI model."
      });
    }, 1000);
  } catch (error) {
    console.error("Error generating project idea:", error);
    res.status(500).json({ error: "Failed to generate project idea" });
  }
});

(async () => {
  const server = await registerRoutes(app);

  // 404 handler for API routes
  app.use('/api', (req, res) => {
    res.status(404).json({ error: 'API route not found' });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Server will run on port 3000 for the API
  const port = 3000;
  server.listen({
    port,
    host: "127.0.0.1"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
