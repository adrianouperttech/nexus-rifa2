import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPrismaClient } from '../utils/prisma';
import { BadRequestError, UnauthorizedError } from '../utils/errors';

const prisma = getPrismaClient();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError('Nome, e-mail e senha são obrigatórios.');
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestError('E-mail já está em uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SUBSCRIBER',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError('E-mail e senha são obrigatórios.');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Credenciais inválidas.');
    }

    if (user.status === 'BLOCKED') {
      throw new UnauthorizedError('Sua conta foi bloqueada pelo administrador.');
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'supers3cr3tnexus',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
