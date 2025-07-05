import { Router } from 'express';
import {
  applyToTender,
  getProposalsForTender,
  getProposalsByCompany,
} from '../controllers/application.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = Router();

/**
 * @route   POST /api/applications/apply
 * @desc    Apply to a tender (requires authentication)
 */
router.post('/apply', verifyToken, applyToTender);

/**
 * @route   GET /api/applications/tender/:tenderId
 * @desc    Get all proposals for a specific tender
 */
router.get('/tender/:tenderId', getProposalsForTender);

/**
 * @route   GET /api/applications/my-proposals
 * @desc    Get all proposals submitted by the authenticated user's company
 */
router.get('/my-proposals', verifyToken, getProposalsByCompany);

export default router;
