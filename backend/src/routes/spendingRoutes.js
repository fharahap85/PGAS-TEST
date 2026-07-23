const express = require('express');
const router = express.Router();
const spendingController = require('../controllers/spendingController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /spendings:
 *   get:
 *     summary: Get all spendings
 *     tags: [Spendings]
 *     responses:
 *       200:
 *         description: List of spendings
 */
router.get('/', authMiddleware, spendingController.getAll);

/**
 * @swagger
 * /spendings/{id}:
 *   get:
 *     summary: Get spending by ID
 *     tags: [Spendings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Spending data
 *       404:
 *         description: Not found
 */
router.get('/:id', authMiddleware, spendingController.getById);

/**
 * @swagger
 * /spendings:
 *   post:
 *     summary: Create spending
 *     tags: [Spendings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employee_id, spending_date, value]
 *             properties:
 *               employee_id:
 *                 type: integer
 *                 example: 1
 *               spending_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               value:
 *                 type: number
 *                 example: 250000.00
 *     responses:
 *       201:
 *         description: Spending created
 */
router.post('/', authMiddleware, spendingController.create);

/**
 * @swagger
 * /spendings/{id}:
 *   put:
 *     summary: Update spending (Admin only)
 *     tags: [Spendings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_id:
 *                 type: integer
 *               spending_date:
 *                 type: string
 *                 format: date
 *               value:
 *                 type: number
 *     responses:
 *       200:
 *         description: Spending updated
 *       403:
 *         description: Admin only
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), spendingController.update);

/**
 * @swagger
 * /spendings/{id}:
 *   delete:
 *     summary: Delete spending (Admin only)
 *     tags: [Spendings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Spending deleted
 *       403:
 *         description: Admin only
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), spendingController.delete);

module.exports = router;
