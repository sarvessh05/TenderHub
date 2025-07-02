import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from './routes/auth.routes';
import companyRoutes from './routes/company.routes';
import tenderRoutes from './routes/tender.routes';
import applicationRoutes from './routes/application.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allows reading JSON in req.body
app.use(express.json());

// ✅ Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/tender', tenderRoutes);
app.use('/api/application', applicationRoutes);

// ✅ Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Tender Management API is running 🚀');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});