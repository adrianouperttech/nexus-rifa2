import { Request, Response, NextFunction } from 'express';
import { getPrismaClient } from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

const prisma = getPrismaClient();

// NOTE: All logic related to 'PlatformPlan' and 'Subscription' has been removed
// as these models do not exist in the Prisma schema.

export const getDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        raffles: true, // This relation exists
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Removed all subscription and plan-related data fetching

    res.json({ success: true, user, raffles: user.raffles });
  } catch (error) {
    next(error);
  }
};

export const listRaffles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const raffles = await prisma.raffle.findMany({ where: { userId } });
    res.json({ success: true, raffles });
  } catch (error) {
    next(error);
  }
};

export const createRaffle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { name, description, price, numbers } = req.body;

    if (!name || !description || !price || !numbers) {
        throw new BadRequestError('Missing required raffle fields.');
    }

    const newRaffle = await prisma.raffle.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        numbers: parseInt(numbers, 10),
        userId: userId!
      },
    });
    res.status(201).json({ success: true, raffle: newRaffle });
  } catch (error) {
    next(error);
  }
};

export const updateRaffle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const raffleId = parseInt(req.params.id, 10);
    const userId = req.user?.id;
    const { name, description, price } = req.body;

    const updatedRaffle = await prisma.raffle.update({
      where: { id: raffleId, userId: userId }, // Ensure user owns the raffle
      data: { name, description, price: price ? parseFloat(price) : undefined },
    });
    res.json({ success: true, raffle: updatedRaffle });
  } catch (error) {
    next(error);
  }
};

export const getRaffleDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const raffleId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId, userId: userId },
      include: {
        ReservationPayment: true, // Changed from RaffleNumber
      },
    });

    if (!raffle) {
      throw new NotFoundError('Raffle not found');
    }
    res.json({ success: true, raffle });
  } catch (error) {
    next(error);
  }
};

// NOTE: All subscription management functions have been removed as the models do not exist.
