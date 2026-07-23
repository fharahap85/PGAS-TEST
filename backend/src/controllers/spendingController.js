const Spending = require('../models/Spending');

/**
 * Spending Controller
 * Handles CRUD, joined data, reports, and exports
 */
class SpendingController {
  /**
   * GET /api/spendings
   */
  async getAll(req, res) {
    try {
      const spendings = await Spending.findAll({ orderBy: 'spending_date', order: 'DESC' });
      const total = await Spending.count();
      res.json({ success: true, data: spendings, total });
    } catch (error) {
      console.error('Get spendings error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/spendings/:id
   */
  async getById(req, res) {
    try {
      const spending = await Spending.findById(req.params.id);
      if (!spending) {
        return res.status(404).json({ success: false, message: 'Spending tidak ditemukan' });
      }
      res.json({ success: true, data: spending });
    } catch (error) {
      console.error('Get spending error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * POST /api/spendings
   */
  async create(req, res) {
    try {
      const { employee_id, spending_date, value } = req.body;
      if (!employee_id || !spending_date || value === undefined) {
        return res.status(400).json({
          success: false,
          message: 'employee_id, spending_date, dan value harus diisi'
        });
      }

      const spending = await Spending.create({ employee_id, spending_date, value });
      res.status(201).json({ success: true, data: spending });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'Employee ID tidak valid' });
      }
      console.error('Create spending error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * PUT /api/spendings/:id
   */
  async update(req, res) {
    try {
      const { employee_id, spending_date, value } = req.body;
      const spending = await Spending.update(req.params.id, { employee_id, spending_date, value });
      if (!spending) {
        return res.status(404).json({ success: false, message: 'Spending tidak ditemukan' });
      }
      res.json({ success: true, data: spending });
    } catch (error) {
      console.error('Update spending error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * DELETE /api/spendings/:id
   */
  async delete(req, res) {
    try {
      const deleted = await Spending.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Spending tidak ditemukan' });
      }
      res.json({ success: true, message: 'Spending berhasil dihapus' });
    } catch (error) {
      console.error('Delete spending error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/reports/spendings
   * Joined data with filters
   */
  async getReport(req, res) {
    try {
      const { search, year, month, minValue, maxValue, limit = 100, offset = 0, sortBy = 'value', sortOrder = 'ASC' } = req.query;

      const result = await Spending.getJoinedData({
        search,
        year: year ? parseInt(year) : undefined,
        month: month ? parseInt(month) : undefined,
        minValue: minValue ? parseFloat(minValue) : undefined,
        maxValue: maxValue ? parseFloat(maxValue) : undefined,
        limit: parseInt(limit),
        offset: parseInt(offset),
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.data,
        total: result.total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } catch (error) {
      console.error('Get report error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/reports/spendings/export/excel
   */
  async exportExcel(req, res) {
    try {
      const XLSX = require('xlsx');
      const { startYear, endYear, minValue, maxValue } = req.query;

      const data = await Spending.getReport({
        startYear: startYear ? parseInt(startYear) : 2020,
        endYear: endYear ? parseInt(endYear) : new Date().getFullYear(),
        minValue: minValue ? parseFloat(minValue) : undefined,
        maxValue: maxValue ? parseFloat(maxValue) : undefined
      });

      const worksheetData = data.map(row => ({
        'Employee Name': row.employee_name,
        'Department': row.department_name,
        'Spending Date': row.spending_date,
        'Value (Rp)': row.value,
        'Year': row.year,
        'Month': row.month_name
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Spending Report');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=spending_report.xlsx');
      res.send(buffer);
    } catch (error) {
      console.error('Export excel error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/reports/spendings/export/pdf
   */
  async exportPdf(req, res) {
    try {
      const { jsPDF } = require('jspdf');
      require('jspdf-autotable');
      const { startYear, endYear, minValue, maxValue } = req.query;

      const data = await Spending.getReport({
        startYear: startYear ? parseInt(startYear) : 2020,
        endYear: endYear ? parseInt(endYear) : new Date().getFullYear(),
        minValue: minValue ? parseFloat(minValue) : undefined,
        maxValue: maxValue ? parseFloat(maxValue) : undefined
      });

      const doc = new jsPDF();

      // Title
      doc.setFontSize(16);
      doc.text('Spending Report - PGAS Solution', 14, 22);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

      // Table
      const tableData = data.map(row => [
        row.employee_name,
        row.department_name,
        new Date(row.spending_date).toLocaleDateString('id-ID'),
        `Rp ${Number(row.value).toLocaleString('id-ID')}`
      ]);

      doc.autoTable({
        head: [['Employee', 'Department', 'Date', 'Value']],
        body: tableData,
        startY: 36,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [59, 130, 246] }
      });

      const buffer = Buffer.from(doc.output('arraybuffer'));

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=spending_report.pdf');
      res.send(buffer);
    } catch (error) {
      console.error('Export pdf error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/reports/power-bi
   * Flat JSON format for Power BI import
   */
  async powerBiData(req, res) {
    try {
      const data = await Spending.getReport({
        startYear: 2020,
        endYear: new Date().getFullYear()
      });

      res.json({
        success: true,
        data: data,
        total: data.length
      });
    } catch (error) {
      console.error('Power BI data error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  /**
   * GET /api/reports/metadata
   * Get filter options (years, value range)
   */
  async getMetadata(req, res) {
    try {
      const [years, valueRange] = await Promise.all([
        Spending.getDistinctYears(),
        Spending.getValueRange()
      ]);

      res.json({
        success: true,
        data: { years, valueRange }
      });
    } catch (error) {
      console.error('Get metadata error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

module.exports = new SpendingController();
