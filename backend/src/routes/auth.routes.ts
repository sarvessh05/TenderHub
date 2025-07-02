import express from 'express';
import { signupUser, loginUser } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/verifytoken';

const router = express.Router();

// Route: POST /api/auth/signup
router.post('/signup', signupUser);

// Route: POST /api/auth/login
router.post('/login', loginUser);

export default router;

router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Welcome! You are authorised.', user: req.user });
});

router.get("/test", (req, res) => {
  res.json({ message: "CORS test passed!" });
});