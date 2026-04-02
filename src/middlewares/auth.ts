import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Acesso Negado. Token não fornecido.'));
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'supers3cr3tnexus') as { userId: string, role: string };
    req.user = verified;
    next();
  } catch (error) {
    return next(new ForbiddenError('Token inválido ou expirado.'));
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new ForbiddenError('Acesso negado. Apenas administradores.'));
  }
  next();
};

export const requireSubscriber = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'SUBSCRIBER') {
    return next(new ForbiddenError('Acesso negado. Apenas assinantes.'));
  }
  next();
};
