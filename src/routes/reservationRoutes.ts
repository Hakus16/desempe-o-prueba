import { Router } from 'express';
import ReservationController from '../controllers/ReservationController';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { validateReservation, validateReservationUpdate } from '../middlewares/validate.middleware';

const router = Router();

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Retrieve all reservations (ADMIN only)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all reservations
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires ADMIN role
 */
router.get('/', authenticateJWT, authorizeRoles('ADMIN'), ReservationController.getAll.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/my-reservations:
 *   get:
 *     summary: Retrieve own reservations for the authenticated user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the authenticated user's reservations
 *       401:
 *         description: Unauthorized
 */
router.get('/my-reservations', authenticateJWT, ReservationController.getMyReservations.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Get a reservation by ID (ADMIN or owner)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access denied to this reservation
 *       404:
 *         description: Reservation not found
 */
router.get('/:id', authenticateJWT, ReservationController.getById.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/user/{userId}:
 *   get:
 *     summary: Get reservations for a specific user (ADMIN or the user)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Cannot access other user's reservations
 */
router.get('/user/:userId', authenticateJWT, ReservationController.getByUser.bind(ReservationController));

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation for the authenticated user
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
 *               - workspaceId
 *               - reservationDate
 *             properties:
 *               workspaceId:
 *                 type: integer
 *               reservationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *       400:
 *         description: Bad request / Workspace unavailable, invalid date, or already reserved for this date
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace or user not found
 *       409:
 *         description: Workspace already reserved for this date
 */
router.post('/', authenticateJWT, validateReservation, ReservationController.create.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Update a reservation date or workspace (ADMIN or owner)
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
 *               workspaceId:
 *                 type: integer
 *               reservationDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *       400:
 *         description: Bad request / Workspace unavailable or conflict
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access denied to update this reservation
 *       404:
 *         description: Reservation or workspace not found
 *       409:
 *         description: Workspace already reserved for this date
 */
router.put('/:id', authenticateJWT, validateReservationUpdate, ReservationController.update.bind(ReservationController));

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Delete a reservation (ADMIN or owner)
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access denied to delete this reservation
 *       404:
 *         description: Reservation not found
 */
router.delete('/:id', authenticateJWT, ReservationController.delete.bind(ReservationController));

export default router;


