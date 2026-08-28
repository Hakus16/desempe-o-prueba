import { Router } from 'express';
import ReservationController from '../controllers/ReservationController';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Retrieve a list of all reservations
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of reservations
 */
router.get('/', authenticateJWT, ReservationController.getAll.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation found
 *       404:
 *         description: Reservation not found
 */
router.get('/:id', authenticateJWT, ReservationController.getById.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/user/{userId}:
 *   get:
 *     summary: Get reservations for a specific user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user reservations
 */
router.get('/user/:userId', authenticateJWT, ReservationController.getByUser.bind(ReservationController));

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - workspaceId
 *               - reservationDate
 *             properties:
 *               userId:
 *                 type: integer
 *               workspaceId:
 *                 type: integer
 *               reservationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Workspace not found or unavailable
 */
router.post('/', authenticateJWT, ReservationController.create.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
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
 *               reservationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       404:
 *         description: Reservation not found
 */
router.put('/:id', authenticateJWT, ReservationController.update.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Reservation deleted successfully
 *       404:
 *         description: Reservation not found
 */
router.delete('/:id', authenticateJWT, ReservationController.delete.bind(ReservationController));

export default router;
