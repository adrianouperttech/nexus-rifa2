import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/auth';
import { NotFoundError, BadRequestError } from '../utils/errors';

export const buyPlan = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.body;
    const userId = req.user!.userId;

    const plan = await prisma.platformPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundError('Plano não encontrado.');

    // Simulação da compra do plano (em produção usaria Stripe/Asaas/MercadoPago do ADMIN)
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status: 'ACTIVE',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
      }
    });

    res.json({ success: true, message: 'Plano atualizado', subscription });
  } catch (error) {
    next(error);
  }
};

export const getDashboardInfo = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const raffles = await prisma.raffle.findMany({ where: { userId } });
    
    // Sum of paid reservations
    const reservations = await prisma.reservationPayment.findMany({
      where: {
        raffle: { userId },
        status: 'APPROVED'
      }
    });
    const totalCollected = reservations.reduce((acc, curr) => acc + curr.amount, 0);

    res.json({
      success: true,
      data: {
        totalRaffles: raffles.length,
        totalCollected,
        raffles
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { pixKey, whatsappToken } = req.body;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { pixKey, whatsappToken }
    });

    res.json({ success: true, user: updated });
  } catch (error) {
    next(error);
  }
};

export const createRaffle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { name, description, pricePerNumber, slug, totalNumbers } = req.body;
    const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    // TODO: Verify if user reached plan limit
    const activeSub = await prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { plan: true }
    });
    
    if (!activeSub) throw new BadRequestError('Você precisa de uma assinatura ativa.');
    
    const countRaffles = await prisma.raffle.count({ where: { userId } });
    if (countRaffles >= activeSub.plan.maxRaffles) {
      throw new BadRequestError(`Seu plano permite apenas ${activeSub.plan.maxRaffles} rifas.`);
    }

    const _totalNumbers = parseInt(totalNumbers);

    const raffle = await prisma.raffle.create({
      data: {
        userId,
        name,
        description,
        slug,
        pricePerNumber: parseFloat(pricePerNumber),
        totalNumbers: _totalNumbers,
        photoUrl
      }
    });

    // Create available numbers explicitly
    const numbersToInsert = Array.from({ length: _totalNumbers }).map((_, i) => ({
      raffleId: raffle.id,
      number: i + 1,
      status: 'AVAILABLE'
    }));

    await prisma.raffleNumber.createMany({
      data: numbersToInsert
    });

    res.status(201).json({ success: true, raffle });
  } catch (error) {
    next(error);
  }
};

export const getRaffles = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const raffles = await prisma.raffle.findMany({ where: { userId } });
    res.json({ success: true, raffles });
  } catch (error) {
    next(error);
  }
};
