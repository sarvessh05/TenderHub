import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import tenderRoutes from './routes/tender.routes';
import applicationRoutes from './routes/application.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ CORS setup (update origin for production)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Base Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/tender', tenderRoutes);
app.use('/api/application', applicationRoutes);

// ✅ Health Check
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 Tender Management API is up and running!');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
