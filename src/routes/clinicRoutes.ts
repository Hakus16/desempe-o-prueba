import { Router } from 'express';
import { createClinic, getClinics, getClinicRequests, updateClinic, deleteClinic } from '../controllers/clinicController';
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

/**
 * @swagger
 * /api/clinics/{id}:
 *   put:
 *     summary: Update a clinic
 *     tags: [Clinics]
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
 *               name:
 *                 type: string
 *               nit:
 *                 type: string
 *               manager_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Clinic updated
 */
router.put('/:id', requireRole(['ADMIN']), updateClinic);

/**
 * @swagger
 * /api/clinics/{id}:
 *   delete:
 *     summary: Delete a clinic (soft delete)
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
 *         description: Clinic logically deleted
 */
router.delete('/:id', requireRole(['ADMIN']), deleteClinic);

export default router;
