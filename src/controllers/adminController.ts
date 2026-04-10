import { Request, Response, NextFunction } from 'express';
import { getPrismaClient } from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';

const prisma = getPrismaClient();

// NOTE: All plan and subscription logic has been removed as the models are not in the schema.

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Removed filtering by 'role' as it does not exist on the User model.
    const users = await prisma.user.findMany();
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

export const getUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      throw new BadRequestError('Invalid user ID.');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        raffles: true, // This relation exists
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Removed counting 'subscriptions' as the model does not exist.
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      throw new BadRequestError('Invalid user ID.');
    }
    
    const { name, email, whatsappToken } = req.body;

    // Removed 'status' update as it does not exist on the User model.
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, whatsappToken },
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// The following functions related to Platform Plans are removed as the model is not in the schema.
/*
export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  next(new Error('Not Implemented: PlatformPlan model does not exist in schema.'));
};

export const listPlans = async (req: Request, res: Response, next: NextFunction) => {
  next(new Error('Not Implemented: PlatformPlan model does not exist in schema.'));
};
*/
