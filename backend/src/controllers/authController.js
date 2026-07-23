const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * Auth Controller
 * Handles login, register, and current user endpoints
 */
class AuthController {
  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email dan password harus diisi'
        });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const isValid = await User.verifyPassword(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Email atau password salah'
        });
      }

      const token = jwt.sign(
        { user_id: user.user_id, email: user.email, role: user.role, username: user.username },
        process.env.JWT_SECRET || 'pgas-test-jwt-secret-key-2026',
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * POST /api/auth/register
   */
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username, email, dan password harus diisi'
        });
      }

      const existing = await User.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Email sudah terdaftar'
        });
      }

      const user = await User.create({ username, email, password, role: role || 'user' });

      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req, res) {
    try {
      const user = await User.findById(req.user.user_id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      }

      const { password_hash, ...safeUser } = user;
      res.json({ success: true, data: safeUser });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new AuthController();
