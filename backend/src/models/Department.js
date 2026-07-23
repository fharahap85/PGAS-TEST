const BaseModel = require('./BaseModel');
const { pool } = require('../config/database');

/**
 * Department Model
 * Extends BaseModel for CRUD operations on the departments table
 */
class Department extends BaseModel {
  constructor() {
    super('departments', 'department_id');
  }

  /**
   * Create a new department
   * @param {object} data - { department_name }
   * @returns {Promise<object>} Created department
   */
  async create(data) {
    const sql = `INSERT INTO departments (department_name) VALUES (?)`;
    const [result] = await pool.query(sql, [data.department_name]);
    return this.findById(result.insertId);
  }

  /**
   * Update department by ID
   * @param {number} id
   * @param {object} data - { department_name }
   * @returns {Promise<object|null>} Updated department
   */
  async update(id, data) {
    const sql = `UPDATE departments SET department_name = ? WHERE department_id = ?`;
    const [result] = await pool.query(sql, [data.department_name, id]);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  /**
   * Search departments by name
   * @param {string} query - Search term
   * @returns {Promise<Array>}
   */
  async search(query) {
    const sql = `SELECT * FROM departments WHERE department_name LIKE ? ORDER BY department_name ASC`;
    const [rows] = await pool.query(sql, [`%${query}%`]);
    return rows;
  }
}

module.exports = new Department();
