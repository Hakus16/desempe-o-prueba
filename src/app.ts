import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import clinicRoutes from './routes/clinicRoutes';
import warehouseRoutes from './routes/warehouseRoutes';
import medicationRoutes from './routes/medicationRoutes';
import requestRoutes from './routes/requestRoutes';
import seedRoutes from './routes/seedRoutes';
import { sequelize } from './models';
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
app.use('/api/auth', authRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/seed', seedRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
