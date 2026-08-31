import { Router } from 'express';
import { createClinic, getClinics, getClinicRequests } from '../controllers/clinicController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

/**
 * @swagger
 * /api/clinics:
 *   post:
 *     summary: Create a new clinic
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               nit:
 *                 type: string
 *               manager_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Clinic created
 */
router.post('/', requireRole(['ADMIN']), createClinic);

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     summary: Get all clinics
 *     tags: [Clinics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clinics
 */
router.get('/', getClinics);

/**
 * @swagger
 * /api/clinics/{id}/requests:
 *   get:
 *     summary: Get requests for a specific clinic
 *     tags: [Clinics]
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
 *         description: List of requests
 */
router.get('/:id/requests', getClinicRequests);

export default router;
