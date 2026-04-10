import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getPrismaClient } from '../utils/prisma';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';

// Defines the structure of the user payload in the JWT
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

const prisma = getPrismaClient();

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Acesso negado. Token não fornecido.'));
  }

  try {
    // Verify the token and extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supers3cr3tnexus') as { userId: string };

    // Fetch the user from the database to get up-to-date info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new UnauthorizedError('Usuário do token não encontrado.'));
    }

    // Attach user information to the request, excluding the password
    req.user = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    next();
  } catch (error) {
    return next(new ForbiddenError('Token inválido ou expirado.'));
  }
};

export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return next(new ForbiddenError('Acesso negado. Requer privilégios de administrador.'));
  }
  next();
};
