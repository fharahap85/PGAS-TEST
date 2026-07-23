const BaseModel = require('./BaseModel');
const { pool } = require('../config/database');

/**
 * Spending Model
 * Extends BaseModel for CRUD operations on the spendings table
 */
class Spending extends BaseModel {
  constructor() {
    super('spendings', 'spending_id');
  }

  /**
   * Create a new spending record
   * @param {object} data - { employee_id, spending_date, value }
   * @returns {Promise<object>} Created spending
   */
  async create(data) {
    const sql = `INSERT INTO spendings (employee_id, spending_date, value) VALUES (?, ?, ?)`;
    const [result] = await pool.query(sql, [data.employee_id, data.spending_date, data.value]);
    return this.findById(result.insertId);
  }

  /**
   * Update spending by ID
   * @param {number} id
   * @param {object} data - { employee_id, spending_date, value }
   * @returns {Promise<object|null>} Updated spending
   */
  async update(id, data) {
    const fields = [];
    const values = [];

    if (data.employee_id !== undefined) {
      fields.push('employee_id = ?');
      values.push(data.employee_id);
    }
    if (data.spending_date !== undefined) {
      fields.push('spending_date = ?');
      values.push(data.spending_date);
    }
    if (data.value !== undefined) {
      fields.push('value = ?');
      values.push(data.value);
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const sql = `UPDATE spendings SET ${fields.join(', ')} WHERE spending_id = ?`;
    const [result] = await pool.query(sql, values);
    if (result.affectedRows === 0) return null;
    return this.findById(id);
  }

  /**
   * Get joined data: spendings + employees + departments
   * Sorted by value ASC (as required by the test)
   * @param {object} filters - { search, year, month, minValue, maxValue, limit, offset }
   * @returns {Promise<{data: Array, total: number}>}
   */
  async getJoinedData(filters = {}) {
    const { search, year, month, minValue, maxValue, limit = 100, offset = 0, sortBy = 'value', sortOrder = 'ASC' } = filters;

    let whereConditions = [];
    let params = [];

    if (search) {
      whereConditions.push('(e.employee_name LIKE ? OR d.department_name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (year) {
      whereConditions.push('YEAR(s.spending_date) = ?');
      params.push(year);
    }
    if (month) {
      whereConditions.push('MONTH(s.spending_date) = ?');
      params.push(month);
    }
    if (minValue !== undefined && minValue !== null) {
      whereConditions.push('s.value >= ?');
      params.push(minValue);
    }
    if (maxValue !== undefined && maxValue !== null) {
      whereConditions.push('s.value <= ?');
      params.push(maxValue);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Validate sort column
    const validSortColumns = { value: 's.value', spending_date: 's.spending_date', employee_name: 'e.employee_name', department_name: 'd.department_name' };
    const sortColumn = validSortColumns[sortBy] || 's.value';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Count total
    const countSql = `
      SELECT COUNT(*) as total
      FROM spendings s
      INNER JOIN employees e ON s.employee_id = e.employee_id
      INNER JOIN departments d ON e.department_id = d.department_id
      ${whereClause}
    `;
    const [countResult] = await pool.query(countSql, params);

    // Get data
    const dataSql = `
      SELECT
        s.spending_id,
        e.employee_id,
        e.employee_name,
        d.department_id,
        d.department_name,
        s.spending_date,
        s.value
      FROM spendings s
      INNER JOIN employees e ON s.employee_id = e.employee_id
      INNER JOIN departments d ON e.department_id = d.department_id
      ${whereClause}
      ORDER BY ${sortColumn} ${order}
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(dataSql, [...params, limit, offset]);

    return {
      data: rows,
      total: countResult[0].total
    };
  }

  /**
   * Get spending report data for specific year range
   * @param {object} filters - { startYear, endYear, minValue, maxValue }
   * @returns {Promise<Array>}
   */
  async getReport(filters = {}) {
    const { startYear = 2020, endYear = 2025, minValue, maxValue } = filters;

    let whereConditions = ['YEAR(s.spending_date) BETWEEN ? AND ?'];
    let params = [startYear, endYear];

    if (minValue !== undefined && minValue !== null) {
      whereConditions.push('s.value >= ?');
      params.push(minValue);
    }
    if (maxValue !== undefined && maxValue !== null) {
      whereConditions.push('s.value <= ?');
      params.push(maxValue);
    }

    const sql = `
      SELECT
        s.spending_id,
        e.employee_name,
        d.department_name,
        s.spending_date,
        s.value,
        YEAR(s.spending_date) AS year,
        MONTH(s.spending_date) AS month,
        MONTHNAME(s.spending_date) AS month_name
      FROM spendings s
      INNER JOIN employees e ON s.employee_id = e.employee_id
      INNER JOIN departments d ON e.department_id = d.department_id
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY s.spending_date ASC, s.value ASC
    `;
    const [rows] = await pool.query(sql, params);
    return rows;
  }

  /**
   * Get min and max spending values (for slider range)
   * @returns {Promise<{min: number, max: number}>}
   */
  async getValueRange() {
    const sql = `SELECT MIN(value) as min_value, MAX(value) as max_value FROM spendings`;
    const [rows] = await pool.query(sql);
    return { min: rows[0].min_value || 0, max: rows[0].max_value || 0 };
  }

  /**
   * Get distinct years in spendings data
   * @returns {Promise<Array<number>>}
   */
  async getDistinctYears() {
    const sql = `SELECT DISTINCT YEAR(spending_date) AS year FROM spendings ORDER BY year ASC`;
    const [rows] = await pool.query(sql);
    return rows.map(r => r.year);
  }
}

module.exports = new Spending();
