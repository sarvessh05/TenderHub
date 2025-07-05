import express from 'express';
import { signupUser, loginUser } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/verifyToken'; // Ensure casing matches filename
import { AuthenticatedRequest } from '../middleware/verifyToken';

const router = express.Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 */
router.post('/signup', signupUser);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/me
 * @desc    Get authenticated user details
 */
router.get('/me', verifyToken, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    message: 'Welcome! You are authorised.',
    user: req.user,
  });
});

/**
 * @route   GET /api/auth/test
 * @desc    Test route for CORS or health check
 */
router.get('/test', (_req, res) => {
  res.json({ message: 'CORS test passed!' });
});

export default router;
