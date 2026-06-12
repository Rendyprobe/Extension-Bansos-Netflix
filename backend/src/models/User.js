import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create(username, password, role = 'user') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO users (username, password_hash, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role, created_at
    `;
    const result = await pool.query(query, [username, hashedPassword, role]);
    return result.rows[0];
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1 AND is_active = true';
    const result = await pool.query(query, [username]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, role, created_at FROM users WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static async findAll() {
    const query = 'SELECT id, username, role, created_at, is_active FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async delete(id) {
    const query = 'UPDATE users SET is_active = false WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}
