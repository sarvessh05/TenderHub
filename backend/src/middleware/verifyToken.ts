import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Custom interface extending Express's Request to hold user data
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string; // Define as per what your JWT contains
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  // No Authorization header or malformed
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized. No token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET is not defined in environment variables.');
    res.status(500).json({ message: 'Internal Server Error. Token secret not configured.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Save decoded token into req.user
    next(); // Pass control to next middleware/route handler
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};
