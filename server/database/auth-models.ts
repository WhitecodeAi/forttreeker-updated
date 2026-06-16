import {
  executeQuery,
  executeQuerySingle,
  executeInsert,
  executeUpdate,
} from "./connection.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const SESSION_EXPIRY_HOURS = 24 * 7; // 7 days

// Type definitions
export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  expiresAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// User Model
export class UserModel {
  static async create(userData: RegisterData): Promise<number> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const result = await executeInsert(
      `
      INSERT INTO users (email, password_hash, full_name, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        userData.email.toLowerCase(),
        hashedPassword,
        userData.fullName,
        userData.phone || null,
        'user',
      ],
    );

    return result.insertId;
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await executeQuerySingle<User>(
      "SELECT * FROM users WHERE email = ? AND is_active = 1",
      [email.toLowerCase()],
    );
  }

  static async findById(id: number): Promise<User | null> {
    return await executeQuerySingle<User>(
      "SELECT * FROM users WHERE id = ? AND is_active = 1",
      [id],
    );
  }

  static async updateLastLogin(userId: number): Promise<void> {
    await executeUpdate(
      `
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [userId],
    );
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async updatePassword(userId: number, newPassword: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await executeUpdate(
      `
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [hashedPassword, userId],
    );

    return result.affectedRows > 0;
  }

  static async getAllUsers(filters: { role?: string; limit?: number; offset?: number } = {}): Promise<User[]> {
    let query = "SELECT id, email, full_name, phone, role, is_active, email_verified, last_login, created_at FROM users WHERE 1=1";
    const params: any[] = [];

    if (filters.role) {
      query += " AND role = ?";
      params.push(filters.role);
    }

    query += " ORDER BY created_at DESC";

    if (filters.limit) {
      query += " LIMIT ?";
      params.push(filters.limit);

      if (filters.offset) {
        query += " OFFSET ?";
        params.push(filters.offset);
      }
    }

    return await executeQuery<User>(query, params);
  }
}

// Session Model
function formatMySQLTimestamp(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export class SessionModel {
  static async create(userId: number): Promise<{ token: string; expiresAt: string }> {
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + SESSION_EXPIRY_HOURS);

    await executeInsert(
      `
      INSERT INTO user_sessions (user_id, session_token, expires_at)
      VALUES (?, ?, ?)
    `,
      [userId, sessionToken, formatMySQLTimestamp(expiresAt)],
    );

    return {
      token: sessionToken,
      expiresAt: expiresAt.toISOString(),
    };
  }

  static async findByToken(token: string): Promise<UserSession | null> {
    return await executeQuerySingle<UserSession>(
      `
      SELECT * FROM user_sessions 
      WHERE session_token = ? AND expires_at > CURRENT_TIMESTAMP
    `,
      [token],
    );
  }

  static async deleteByToken(token: string): Promise<boolean> {
    const result = await executeUpdate(
      "DELETE FROM user_sessions WHERE session_token = ?",
      [token],
    );

    return result.affectedRows > 0;
  }

  static async deleteByUserId(userId: number): Promise<boolean> {
    const result = await executeUpdate(
      "DELETE FROM user_sessions WHERE user_id = ?",
      [userId],
    );

    return result.affectedRows > 0;
  }

  static async cleanExpiredSessions(): Promise<void> {
    await executeUpdate(
      "DELETE FROM user_sessions WHERE expires_at <= CURRENT_TIMESTAMP",
      [],
    );
  }
}

// Authentication Service
export class AuthService {
  static async register(userData: RegisterData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user
    const userId = await UserModel.create(userData);
    
    // Get created user
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }

    // Create session
    const session = await SessionModel.create(userId);

    // Update last login
    await UserModel.updateLastLogin(userId);

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  }

  static async login(loginData: LoginData): Promise<AuthResponse> {
    // Find user
    const user = await UserModel.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await UserModel.verifyPassword(loginData.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const session = await SessionModel.create(user.id);

    // Update last login
    await UserModel.updateLastLogin(user.id);

    // Remove password from response
    const { password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  }

  static async logout(token: string): Promise<boolean> {
    return SessionModel.deleteByToken(token);
  }

  static async validateSession(token: string): Promise<User | null> {
    const session = await SessionModel.findByToken(token);
    if (!session) {
      return null;
    }

    const user = await UserModel.findById(session.user_id);
    return user;
  }

  static async getUserFromToken(token: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.validateSession(token);
    if (!user) {
      return null;
    }

    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
