// routes/tender.routes.ts

import { Router } from 'express';
import { createTender, getAllTenders } from '../controllers/tender.controller';
import { verifyToken } from '../middleware/verifyToken'; // ✅ Make sure file name casing matches

const router = Router();

// Protected route: Only logged-in users can create tenders
router.post('/create', verifyToken, createTender);

// Public route: Anyone can view all tenders
router.get('/all', getAllTenders);

export default router;
