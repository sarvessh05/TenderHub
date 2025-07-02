import { Router } from 'express';
import { createTender } from '../controllers/tender.controller';
import { verifyToken } from '../middleware/verifytoken';
import { getAllTenders } from '../controllers/tender.controller';

const router = Router();

router.post('/create', verifyToken, createTender);
router.get('/all', getAllTenders);

export default router;