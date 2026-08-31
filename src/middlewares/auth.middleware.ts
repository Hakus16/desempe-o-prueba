import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface UserPayload {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Token is required' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err || !decoded) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    req.user = decoded as UserPayload;
    next();
  });
};

export const authorizeRoles = (...allowedRoles: ('ADMIN' | 'USER')[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

