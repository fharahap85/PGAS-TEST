const { pool } = require('../config/database');

/**
 * Base Model class implementing common CRUD operations using raw SQL (bare query)
 * Demonstrates OOP principles: encapsulation, inheritance
 */
class BaseModel {
  /**
   * @param {string} tableName - Name of the database table
   * @param {string} primaryKey - Primary key column name
   */
  constructor(tableName, primaryKey) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  /**
   * Find all records
   * @param {object} options - Query options { limit, offset, orderBy, order }
   * @returns {Promise<Array>}
   */
  async findAll(options = {}) {
    const { limit = 100, offset = 0, orderBy = this.primaryKey, order = 'ASC' } = options;
    const sql = `SELECT * FROM ${this.tableName} ORDER BY ${orderBy} ${order} LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(sql, [limit, offset]);
    return rows;
  }

  /**
   * Find record by primary key
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  }

  /**
   * Count total records
   * @param {string} whereClause - Optional WHERE clause
   * @param {Array} params - Query parameters
   * @returns {Promise<number>}
   */
  async count(whereClause = '', params = []) {
    const sql = `SELECT COUNT(*) as total FROM ${this.tableName} ${whereClause}`;
    const [rows] = await pool.query(sql, params);
    return rows[0].total;
  }

  /**
   * Delete record by primary key
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?`;
    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = BaseModel;
