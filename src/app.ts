import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import reservationRoutes from './routes/reservationRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './utils/swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
setupSwagger(app);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/reservations', reservationRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
