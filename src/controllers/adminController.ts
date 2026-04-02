import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { NotFoundError } from '../utils/errors';

export const getDashboardInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalSubscribers = await prisma.user.count({ where: { role: 'SUBSCRIBER' } });
    const totalPlans = await prisma.platformPlan.count();
    
    // For revenue, we sum the amount from ReservationPayment that is APPROVED
    // Or from subscriptions depending on the business model. We'll simulate from subscriptions.
    
    res.json({
      success: true,
      data: {
        totalSubscribers,
        totalPlans,
        // placeholder for actual revenue logic
        totalRevenue: 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listSubscribers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscribers = await prisma.user.findMany({
      where: { role: 'SUBSCRIBER' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true,
        _count: {
          select: { raffles: true, subscriptions: true }
        }
      }
    });
    res.json({ success: true, subscribers });
  } catch (error) {
    next(error);
  }
};

export const toggleSubscriberStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { status } = req.body; // ACTIVE or BLOCKED

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError('Usuário não encontrado');

    const updated = await prisma.user.update({
      where: { id },
      data: { status }
    });

    res.json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};

export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, maxRaffles, price, cycle } = req.body;
    const plan = await prisma.platformPlan.create({
      data: { name, maxRaffles, price, cycle }
    });
    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

export const getPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = await prisma.platformPlan.findMany();
    res.json({ success: true, plans });
  } catch (error) {
    next(error);
  }
};
