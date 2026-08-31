import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.middleware';
import { validateRegister, validateLogin } from '../middlewares/validate.middleware';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create / Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 default: USER
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request (missing fields, invalid email format, invalid role, or email already registered)
 */
router.post('/', validateRegister, UserController.create.bind(UserController));

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 default: USER
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', validateRegister, UserController.register.bind(UserController));

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, token returned
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, UserController.login.bind(UserController));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all users (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of registered users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires ADMIN role
 */
router.get('/', authenticateJWT, authorizeRoles('ADMIN'), UserController.getAll.bind(UserController));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID (ADMIN or owner)
 *     tags: [Users]
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
 *         description: User found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access denied to view this user
 *       404:
 *         description: User not found
 */
router.get('/:id', authenticateJWT, UserController.getById.bind(UserController));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (ADMIN or owner)
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request (e.g. invalid role, invalid email)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Access denied to update this user
 *       404:
 *         description: User not found
 *       409:
 *         description: Email already in use
 */
router.put('/:id', authenticateJWT, UserController.update.bind(UserController));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (ADMIN only)
 *     tags: [Users]
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
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires ADMIN role
 *       404:
 *         description: User not found
 */
router.delete('/:id', authenticateJWT, authorizeRoles('ADMIN'), UserController.delete.bind(UserController));

export default router;

