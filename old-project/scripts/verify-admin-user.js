
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function verifyAdmin() {
  console.log("🔍 Connecting to database...", {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
  });

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected!");

    // Check if users table exists
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'`,
      [dbConfig.database]
    );

    if (tables.length === 0) {
      console.log("❌ Users table does not exist!");
      return;
    }

    console.log("✅ Users table exists.");

    // Check if admin user exists
    const [users] = await connection.execute(
      `SELECT * FROM users WHERE email = ?`,
      ['admin@forttracker.com']
    );

    if (users.length > 0) {
      const user = users[0];
      console.log("✅ Admin user found:");
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Is Active: ${user.is_active}`);
      
      // Verify password 'admin123'
      const match = await bcrypt.compare('admin123', user.password_hash);
      if (match) {
          console.log("✅ Password 'admin123' is VALID.");
      } else {
          console.log("⚠️ Password 'admin123' is NOT VALID.");
          console.log("🔄 Resetting password to 'admin123'...");
          const newHash = await bcrypt.hash('admin123', 10);
          await connection.execute(
              `UPDATE users SET password_hash = ? WHERE id = ?`,
              [newHash, user.id]
          );
          console.log("✅ Password reset to 'admin123'.");
      }

    } else {
      console.log("⚠️ Admin user NOT found.");
      console.log("➕ Creating admin user...");
      
      const newHash = await bcrypt.hash('admin123', 10);
      await connection.execute(
        `INSERT INTO users (email, password_hash, full_name, role, is_active, email_verified)
         VALUES (?, ?, ?, ?, ?, ?)`,
        ['admin@forttracker.com', newHash, 'System Administrator', 'admin', 1, 1]
      );
      console.log("✅ Admin user created (admin@forttracker.com / admin123).");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    if (connection) await connection.end();
  }
}

verifyAdmin();
