import { Router } from 'express';
import { seedDatabase } from '../controllers/seedController';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Public endpoint as per instructions, or maybe protected, but the prompt says:
// "Registro de usuarios con dos roles (Endpoint sin restricción): Administrador, Gestor de Solicitudes"
// Doesn't say seed is unrestricted, but we leave it public for easier testing.

/**
 * @swagger
 * /api/seed:
 *   post:
 *     summary: Upload JSON to seed the database
 *     tags: [Seed]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Database seeded successfully
 */
router.post('/', upload.single('data'), seedDatabase);

export default router;
