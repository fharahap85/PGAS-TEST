const Employee = require('../models/Employee');

/**
 * Employee Controller
 * Handles CRUD operations for employees
 */
class EmployeeController {
  /**
   * GET /api/employees
   */
  async getAll(req, res) {
    try {
      const { search, limit = 100, offset = 0 } = req.query;

      let employees;
      if (search) {
        employees = await Employee.search(search);
      } else {
        employees = await Employee.findAllWithDepartment({
          limit: parseInt(limit),
          offset: parseInt(offset)
        });
      }

      const total = await Employee.count();

      res.json({
        success: true,
        data: employees,
        total
      });
    } catch (error) {
      console.error('Get employees error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/employees/:id
   */
  async getById(req, res) {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee tidak ditemukan' });
      }
      res.json({ success: true, data: employee });
    } catch (error) {
      console.error('Get employee error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * POST /api/employees
   */
  async create(req, res) {
    try {
      const { employee_name, department_id } = req.body;
      if (!employee_name || !department_id) {
        return res.status(400).json({
          success: false,
          message: 'employee_name dan department_id harus diisi'
        });
      }

      const employee = await Employee.create({ employee_name, department_id });
      res.status(201).json({ success: true, data: employee });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({
          success: false,
          message: 'Department ID tidak valid'
        });
      }
      console.error('Create employee error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * PUT /api/employees/:id
   */
  async update(req, res) {
    try {
      const { employee_name, department_id } = req.body;

      const employee = await Employee.update(req.params.id, { employee_name, department_id });
      if (!employee) {
        return res.status(404).json({ success: false, message: 'Employee tidak ditemukan' });
      }
      res.json({ success: true, data: employee });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'Department ID tidak valid' });
      }
      console.error('Update employee error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/employees/:id
   */
  async delete(req, res) {
    try {
      const deleted = await Employee.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Employee tidak ditemukan' });
      }
      res.json({ success: true, message: 'Employee berhasil dihapus' });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          success: false,
          message: 'Employee tidak dapat dihapus karena masih memiliki spending terkait'
        });
      }
      console.error('Delete employee error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new EmployeeController();
