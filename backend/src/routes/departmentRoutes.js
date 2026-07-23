const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by department name
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Department'
 */
router.get('/', authMiddleware, departmentController.getAll);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Department data
 *       404:
 *         description: Not found
 */
router.get('/:id', authMiddleware, departmentController.getById);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [department_name]
 *             properties:
 *               department_name:
 *                 type: string
 *                 example: Research & Development
 *     responses:
 *       201:
 *         description: Department created
 */
router.post('/', authMiddleware, departmentController.create);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update department (Admin only)
 *     tags: [Departments]
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
 *             required: [department_name]
 *             properties:
 *               department_name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated
 *       403:
 *         description: Admin only
 */
router.put('/:id', authMiddleware, roleMiddleware('admin'), departmentController.update);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete department (Admin only)
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Department deleted
 *       403:
 *         description: Admin only
 *       409:
 *         description: Has related employees
 */
router.delete('/:id', authMiddleware, roleMiddleware('admin'), departmentController.delete);

module.exports = router;
