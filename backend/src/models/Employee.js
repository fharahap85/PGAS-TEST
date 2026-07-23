const BaseModel = require('./BaseModel');
const { pool } = require('../config/database');

/**
 * Employee Model
 * Extends BaseModel for CRUD operations on the employees table
 */
class Employee extends BaseModel {
  constructor() {
    super('employees', 'employee_id');
  }

  /**
   * Create a new employee
   * @param {object} data - { employee_name, department_id }
   * @returns {Promise<object>} Created employee
   */
  async create(data) {
    const sql = `INSERT INTO employees (employee_name, department_id) VALUES (?, ?)`;
    const [result] = await pool.query(sql, [data.employee_name, data.department_id]);
    return this.findById(result.insertId);
  }

  /**
   * Update employee by ID
   * @param {number} id
   * @param {object} data - { employee_name, department_id }
   * @returns {Promise<object|null>} Updated employee
   */
  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.employee_name !== undefined) {
      fields.push('employee_name = ?');
      values.push(data.employee_name);
    }
    if (data.department_id !== undefined) {
      fields.push('department_id = ?');
      values.push(data.department_id);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const sql = `UPDATE employees SET ${fields.join(', ')} WHERE employee_id = ?`;
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  /**
   * Search employees by name
   * @param {string} query - Search term
   * @returns {Promise<Array>}
   */
  async search(query) {
    const sql = `
      SELECT e.*, d.department_name
      FROM employees e
      INNER JOIN departments d ON e.department_id = d.department_id
      WHERE e.employee_name LIKE ?
      ORDER BY e.employee_name ASC
    `;
    const [rows] = await pool.query(sql, [`%${query}%`]);
    return rows;
  }

  /**
   * Find all employees with department info
   * @param {object} options - { limit, offset }
   * @returns {Promise<Array>}
   */
  async findAllWithDepartment(options = {}) {
    const { limit = 100, offset = 0 } = options;
    const sql = `
      SELECT e.*, d.department_name
      FROM employees e
      INNER JOIN departments d ON e.department_id = d.department_id
      ORDER BY e.employee_id ASC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [limit, offset]);
    return rows;
  }
}

module.exports = new Employee();
