import { Router } from 'express';
import { createMedication, getMedications } from '../controllers/medicationController';
import { authenticateJWT, requireRole } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateJWT);

/**
 * @swagger
 * /api/medications:
 *   post:
 *     summary: Create a new medication
 *     tags: [Medications]
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
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medication created
 */
router.post('/', requireRole(['ADMIN']), createMedication);

/**
 * @swagger
 * /api/medications:
 *   get:
 *     summary: Get all medications
 *     tags: [Medications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of medications
 */
router.get('/', getMedications);

export default router;
