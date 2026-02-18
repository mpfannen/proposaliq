import pool from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserInput {
  email: string;
  password: string;
  name: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

class UserModel {
  // Create a new user
  async create(userData: UserInput): Promise<UserResponse> {
    console.log('🔵 UserModel.create called with:', { email: userData.email, name: userData.name });
    const { email, password, name } = userData;

    try {
      // Hash password
      console.log('🔵 Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO users (email, password, name)
        VALUES ($1, $2, $3)
        RETURNING id, email, name, created_at, updated_at
      `;

      console.log('🔵 Executing INSERT query...');
      const result = await pool.query(query, [email, hashedPassword, name]);
      console.log('✅ User created successfully:', result.rows[0].id);
      return result.rows[0];
    } catch (error: any) {
      console.error('❌ UserModel.create error:', error.message);
      throw error;
    }
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  // Find user by ID
  async findById(id: number): Promise<UserResponse | null> {
    const query = `
      SELECT id, email, name, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // Compare password
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    const query = 'SELECT id FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows.length > 0;
  }

  // Update name and/or email
  async updateProfile(id: number, updates: { name?: string; email?: string }): Promise<UserResponse | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (updates.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }
    if (updates.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }
    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `
      UPDATE users SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, name, created_at, updated_at
    `;
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // Update password
  async updatePassword(id: number, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, id]);
  }
}

export default new UserModel();
