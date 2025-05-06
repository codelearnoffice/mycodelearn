import { pool } from './db';
import session from 'express-session';
import MemoryStore from 'memorystore';

const MemoryStoreSession = MemoryStore(session);

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  profession?: string;
}

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;

  // Session store
  sessionStore: any;

  // Feature usage
  trackFeatureUsage(userId: number, featureType: string): Promise<void>;
  getFeatureUsageCount(userId: number, featureType: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  public pool = pool;
  // Save a new project for a user
  async saveProject({ userId, title, description, content }: { userId: number; title: string; description?: string; content: string; }) {
    const [result]: any = await pool.execute(
      'INSERT INTO projects (user_id, title, description, content) VALUES (?, ?, ?, ?)',
      [userId, title, description || '', content]
    );
    const id = result.insertId;
    // Return the saved project
    return {
      id,
      user_id: userId,
      title,
      description: description || '',
      content
    };
  }
  sessionStore: any;

  constructor() {
    this.sessionStore = new MemoryStoreSession({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as any[])[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return (rows as any[])[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return (rows as any[])[0];
  }

  async createUser(userData: any): Promise<User> {
    const { username, email, password, full_name, phone_number, profession, referral_source } = userData;

    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, full_name, phone_number, profession, referral_source) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [username, email, password, full_name, phone_number, profession, referral_source]
    );

    const id = (result as any).insertId;
    return this.getUser(id) as Promise<User>;
  }

  async getUserProjects(userId: number) {
    const [rows] = await pool.execute("SELECT * FROM projects WHERE user_id = ?", [userId]);
    return rows;
  }

  async trackFeatureUsage(userId: number, featureType: string) {
    await pool.execute(
      "INSERT INTO feature_usage (user_id, feature_type, used_at) VALUES (?, ?, NOW())",
      [userId, featureType]
    );
  }

  async getFeatureUsageCount(userId: number, featureType: string): Promise<number> {
    const [rows]: any = await pool.execute(
      "SELECT COUNT(*) as count FROM feature_usage WHERE user_id = ? AND feature_type = ?",
      [userId, featureType]
    );
    return rows[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();