import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create MySQL connection pool
export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'codementor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the database connection
export const db = pool;

// Initialize database
export const initDb = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        phone_number VARCHAR(20),
        profession VARCHAR(100),
        referral_source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('MySQL database initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error initializing MySQL database:', error);
    throw error;
  }
};

// Initialize the database on startup
initDb().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
