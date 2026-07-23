const express = require('express');
const router = express.Router();
const spendingController = require('../controllers/spendingController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /reports/spendings:
 *   get:
 *     summary: Get spending report (joined data with filters)
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by employee or department name
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filter by year
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filter by month (1-12)
 *       - in: query
 *         name: minValue
 *         schema:
 *           type: number
 *         description: Minimum spending value
 *       - in: query
 *         name: maxValue
 *         schema:
 *           type: number
 *         description: Maximum spending value
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [value, spending_date, employee_name, department_name]
 *           default: value
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: ASC
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Spending report data
 */
router.get('/spendings', authMiddleware, spendingController.getReport);

/**
 * @swagger
 * /reports/metadata:
 *   get:
 *     summary: Get report filter metadata (years, value range)
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Filter metadata
 */
router.get('/metadata', authMiddleware, spendingController.getMetadata);

/**
 * @swagger
 * /reports/spendings/export/excel:
 *   get:
 *     summary: Export spending report as Excel
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *           default: 2020
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minValue
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxValue
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Excel file download
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/spendings/export/excel', authMiddleware, spendingController.exportExcel);

/**
 * @swagger
 * /reports/spendings/export/pdf:
 *   get:
 *     summary: Export spending report as PDF
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: startYear
 *         schema:
 *           type: integer
 *           default: 2020
 *       - in: query
 *         name: endYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minValue
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxValue
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: PDF file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/spendings/export/pdf', authMiddleware, spendingController.exportPdf);

/**
 * @swagger
 * /reports/power-bi:
 *   get:
 *     summary: Get flat JSON data for Power BI
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Power BI compatible data
 */
router.get('/power-bi', authMiddleware, spendingController.powerBiData);

module.exports = router;
