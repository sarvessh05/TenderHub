import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define a custom interface for the decoded token payload
interface DecodedToken extends JwtPayload {
  id: string;
  email?: string; // add other fields if present in your JWT
}

// Extend the Express Request to include a typed user field
export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

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
    const decoded = jwt.verify(token, secret) as DecodedToken;
    req.user = decoded; // Now properly typed
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized. Invalid token.' });
  }
};
