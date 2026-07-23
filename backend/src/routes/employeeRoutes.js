const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by employee name
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
 *         description: List of employees
 */
router.get('/', authMiddleware, employeeController.getAll);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee data
 *       404:
 *         description: Not found
 */
router.get('/:id', authMiddleware, employeeController.getById);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employee_name, department_id]
 *             properties:
 *               employee_name:
 *                 type: string
 *                 example: Ahmad Fauzi
 *               department_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Employee created
 */
router.post('/', authMiddleware, employeeController.create);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee (Admin only)
 *     tags: [Employees]
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
 *               employee_name:
 *                 type: string
 *               department_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Employee updated
 *       403:
 *         description: Admin only
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), employeeController.update);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee (Admin only)
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Employee deleted
 *       403:
 *         description: Admin only
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), employeeController.delete);

module.exports = router;
