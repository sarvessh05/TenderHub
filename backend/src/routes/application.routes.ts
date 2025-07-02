import { Router } from 'express';
import { applyToTender } from '../controllers/application.controller';
import { verifyToken } from '../middleware/verifyToken';
import { getProposalsForTender, getProposalsByCompany } from '../controllers/application.controller';

const router = Router();

router.post('/apply', verifyToken, applyToTender);
router.get('/tender/:tenderId', getProposalsForTender);
router.get('/my-proposals', verifyToken, getProposalsByCompany);

export default router;