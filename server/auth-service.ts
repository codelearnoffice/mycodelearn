import { pool } from './db';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { log } from './vite';

// JWT Secret - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-should-be-in-env-file';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

// Validation schemas
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  profession: z.string().optional(),
  referralSource: z.string().optional(),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

export interface UserData {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  profession?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export class AuthService {
  // Generate JWT token
  private static generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  // Verify JWT token
  static verifyToken(token: string): { userId: number } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  // Register a new user
  static async registerUser(userData: RegisterData): Promise<AuthResponse> {
    try {
      // Validate user data
      const validatedData = registerSchema.parse(userData);
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Check if username already exists
      const [usernameRows]: any = await pool.execute(
        'SELECT id FROM users WHERE username = ?',
        [validatedData.username]
      );
      
      if (usernameRows.length > 0) {
        throw new Error('Username already exists');
      }
      
      // Check if email already exists
      const [emailRows]: any = await pool.execute(
        'SELECT id FROM users WHERE email = ?',
        [validatedData.email]
      );
      
      if (emailRows.length > 0) {
        throw new Error('Email already exists');
      }
      
      // Insert the new user
      const [result]: any = await pool.execute(
        `INSERT INTO users (
          username, 
          email, 
          password, 
          full_name, 
          phone_number, 
          profession, 
          referral_source
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          validatedData.username,
          validatedData.email,
          hashedPassword,
          validatedData.fullName || null,
          validatedData.phoneNumber || null,
          validatedData.profession || null,
          validatedData.referralSource || null
        ]
      );
      
      const userId = result.insertId;
      
      // Generate JWT token
      const token = this.generateToken(userId);
      
      // Return user data and token
      const user: UserData = {
        id: userId,
        username: validatedData.username,
        email: validatedData.email,
        fullName: validatedData.fullName,
        profession: validatedData.profession
      };
      
      log(`User registered: ${validatedData.username} (ID: ${userId})`);
      
      return { user, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  // Login a user
  static async loginUser(loginData: LoginData): Promise<AuthResponse> {
    try {
      // Validate login data
      const validatedData = loginSchema.parse(loginData);
      
      // Find the user by username or email
      const [rows]: any = await pool.execute(
        'SELECT id, username, email, password, full_name, profession FROM users WHERE username = ? OR email = ?',
        [validatedData.username, validatedData.username]
      );
      
      if (rows.length === 0) {
        throw new Error('Invalid credentials');
      }
      
      const user = rows[0];
      
      // Verify the password
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      
      // Generate JWT token
      const token = this.generateToken(user.id);
      
      // Return user data and token
      const userData: UserData = {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        profession: user.profession
      };
      
      log(`User logged in: ${user.username} (ID: ${user.id})`);
      
      return { user: userData, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  // Get user by ID
  static async getUserById(userId: number): Promise<UserData | null> {
    try {
      const [rows]: any = await pool.execute(
        'SELECT id, username, email, full_name, profession FROM users WHERE id = ?',
        [userId]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      const user = rows[0];
      
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        profession: user.profession
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }
}