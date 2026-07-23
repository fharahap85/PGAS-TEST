const Department = require('../models/Department');

/**
 * Department Controller
 * Handles CRUD operations for departments
 */
class DepartmentController {
  /**
   * GET /api/departments
   */
  async getAll(req, res) {
    try {
      const { search } = req.query;

      let departments;
      if (search) {
        departments = await Department.search(search);
      } else {
        departments = await Department.findAll({ orderBy: 'department_name', order: 'ASC' });
      }

      res.json({
        success: true,
        data: departments,
        total: departments.length
      });
    } catch (error) {
      console.error('Get departments error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/departments/:id
   */
  async getById(req, res) {
    try {
      const department = await Department.findById(req.params.id);
      if (!department) {
        return res.status(404).json({ success: false, message: 'Department tidak ditemukan' });
      }
      res.json({ success: true, data: department });
    } catch (error) {
      console.error('Get department error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * POST /api/departments
   */
  async create(req, res) {
    try {
      const { department_name } = req.body;
      if (!department_name) {
        return res.status(400).json({ success: false, message: 'department_name harus diisi' });
      }

      const department = await Department.create({ department_name });
      res.status(201).json({ success: true, data: department });
    } catch (error) {
      console.error('Create department error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * PUT /api/departments/:id
   */
  async update(req, res) {
    try {
      const { department_name } = req.body;
      if (!department_name) {
        return res.status(400).json({ success: false, message: 'department_name harus diisi' });
      }

      const department = await Department.update(req.params.id, { department_name });
      if (!department) {
        return res.status(404).json({ success: false, message: 'Department tidak ditemukan' });
      }
      res.json({ success: true, data: department });
    } catch (error) {
      console.error('Update department error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/departments/:id
   */
  async delete(req, res) {
    try {
      const deleted = await Department.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Department tidak ditemukan' });
      }
      res.json({ success: true, message: 'Department berhasil dihapus' });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(409).json({
          success: false,
          message: 'Department tidak dapat dihapus karena masih memiliki employee terkait'
        });
      }
      console.error('Delete department error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new DepartmentController();
