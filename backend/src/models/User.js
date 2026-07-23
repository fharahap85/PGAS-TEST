const BaseModel = require('./BaseModel');
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Extends BaseModel for user authentication operations
 */
class User extends BaseModel {
  constructor() {
    super('users', 'user_id');
  }

  /**
   * Find user by email
   * @param {string} email
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.query(sql, [email]);
    return rows[0] || null;
  }

  /**
   * Create a new user
   * @param {object} data - { username, email, password, role }
   * @returns {Promise<object>} Created user (without password_hash)
   */
  async create(data) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const sql = `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.query(sql, [
      data.username,
      data.email,
      passwordHash,
      data.role || 'user'
    ]);

    const user = await this.findById(result.insertId);
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Verify password against stored hash
   * @param {string} password - Plain text password
   * @param {string} hash - Stored bcrypt hash
   * @returns {Promise<boolean>}
   */
  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

module.exports = new User();
