import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ambulanceRoutes from './routes/ambulanceRoutes';
import doctorRoutes from './routes/doctorRoutes';
import authRoutes from './routes/authRoutes';
import './database/database'; // Initialize database

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SOS API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/doctors', doctorRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚑 SOS API server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🚨 Ambulances: http://localhost:${PORT}/api/ambulances`);
  console.log(`👨‍⚕️ Doctors: http://localhost:${PORT}/api/doctors`);
});

export default app;

