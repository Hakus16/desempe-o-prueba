import { Router } from 'express';
import WorkspaceController from '../controllers/WorkspaceController';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { validateWorkspace, validateWorkspaceUpdate } from '../middlewares/validate.middleware';

const router = Router();

/**
 * @swagger
 * /api/workspaces:
 *   get:
 *     summary: Retrieve a list of all workspaces
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of workspaces
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateJWT, WorkspaceController.getAll.bind(WorkspaceController));

/**
 * @swagger
 * /api/workspaces/{id}:
 *   get:
 *     summary: Get a workspace by ID
 *     tags: [Workspaces]
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
 *         description: Workspace found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workspace not found
 */
router.get('/:id', authenticateJWT, WorkspaceController.getById.bind(WorkspaceController));

/**
 * @swagger
 * /api/workspaces:
 *   post:
 *     summary: Create a new workspace (Admin only)
 *     tags: [Workspaces]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Workspace created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires ADMIN role
 *       409:
 *         description: Workspace name already exists
 */
router.post('/', authenticateJWT, authorizeRoles('ADMIN'), validateWorkspace, WorkspaceController.create.bind(WorkspaceController));

/**
 * @swagger
 * /api/workspaces/{id}:
 *   put:
 *     summary: Update a workspace (Admin only)
 *     tags: [Workspaces]
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
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Workspace updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires ADMIN role
 *       404:
 *         description: Workspace not found
 */
router.put('/:id', authenticateJWT, authorizeRoles('ADMIN'), validateWorkspaceUpdate, WorkspaceController.update.bind(WorkspaceController));

/**
 * @swagger
 * /api/workspaces/{id}:
 *   delete:
 *     summary: Delete a workspace (Admin only)
 *     tags: [Workspaces]
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
 *         description: Workspace deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires ADMIN role
 *       404:
 *         description: Workspace not found
 */
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), WorkspaceController.delete.bind(WorkspaceController));

export default router;

