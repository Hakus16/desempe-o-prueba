import { Router } from 'express';
import { createRequest, getRequests, assignWarehouse, updateStatus, getActiveRequests, updateRequest, deleteRequest } from '../controllers/requestController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new supply request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clinic_id:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     medication_id:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Request created
 */
router.post('/', requireRole(['ADMIN', 'REQUEST_MANAGER']), createRequest);

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Get all supply requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 */
router.get('/', getRequests);

/**
 * @swagger
 * /api/requests/{id}/assign:
 *   put:
 *     summary: Assign a warehouse to a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               warehouse_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Request assigned
 */
router.put('/:id/assign', requireRole(['ADMIN']), assignWarehouse);

/**
 * @swagger
 * /api/requests/{id}/status:
 *   put:
 *     summary: Update the status of a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ASSIGNED, SHIPPED, DELIVERED, REJECTED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.put('/:id/status', requireRole(['ADMIN', 'REQUEST_MANAGER']), updateStatus);

/**
 * @swagger
 * /api/requests/active:
 *   get:
 *     summary: Get active supply requests
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active requests
 */
router.get('/active', getActiveRequests);

/**
 * @swagger
 * /api/requests/{id}:
 *   put:
 *     summary: Update a request (only if PENDING)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clinic_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Request updated
 */
router.put('/:id', requireRole(['ADMIN']), updateRequest);

/**
 * @swagger
 * /api/requests/{id}:
 *   delete:
 *     summary: Delete a request (soft delete)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request logically deleted
 */
router.delete('/:id', requireRole(['ADMIN']), deleteRequest);

export default router;
