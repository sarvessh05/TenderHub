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

// ✅ CORS setup — allow specific frontend URLs (local + Vercel)
const allowedOrigins = [
  'http://localhost:3000',
  'https://tender-hub-one.vercel.app',
  'https://tender-bvyjmiw1f-sarvesh-ghotekars-projects.vercel.app', // fallback Vercel preview deployment
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/tender', tenderRoutes);
app.use('/api/application', applicationRoutes);

// ✅ Health check
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 Tender Management API is up and running!');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
