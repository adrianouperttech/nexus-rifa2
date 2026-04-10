import { Request, Response, NextFunction } from 'express';
import { getPrismaClient } from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';
// Logic for payment processing (e.g., Mercado Pago) would be in a separate service.
// import { createPayment } from '../services/paymentService';

const prisma = getPrismaClient();

export const getRaffleDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raffleId = parseInt(req.params.id, 10);
    if (isNaN(raffleId)) {
      throw new BadRequestError('Invalid raffle ID.');
    }

    // Removed 'slug' and included 'ReservationPayment' instead of 'numbers'
    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      include: {
        user: { select: { name: true } },
        ReservationPayment: { // This relation exists
          where: { status: 'pending' }, // Example filter
          select: { number: true, status: true }
        }
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

export const reserveNumbers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const raffleId = parseInt(req.params.id, 10);
    const { name, phone, numbers } = req.body; // Expect an array of numbers

    if (isNaN(raffleId) || !name || !phone || !Array.isArray(numbers) || numbers.length === 0) {
      throw new BadRequestError('Invalid request body.');
    }

    const raffle = await prisma.raffle.findUnique({ where: { id: raffleId } });
    if (!raffle) {
      throw new NotFoundError('Raffle not found');
    }

    // Using transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Using `findFirst` as `ticketBuyer` model does not exist. A buyer is created per reservation.
      let buyer = await tx.buyer.create({
        data: { name, phone }
      });

      const amount = raffle.price * numbers.length;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiration

      // Mock payment creation - in a real app, this would call a payment gateway service
      const pixCopyPaste = `mock-pix-code-for-${raffleId}-${buyer.id}`;
      
      const reservationData = numbers.map(number => ({
        raffleId: raffle.id,
        buyerId: buyer.id,
        number: number,
        status: 'pending',
        expiresAt: expiresAt,
        amount: raffle.price,
        pixCopyPaste: pixCopyPaste, // Storing pix info with reservation
      }));

      // This replaces the old logic of updating RaffleNumber which does not exist.
      await tx.reservationPayment.createMany({
        data: reservationData,
        skipDuplicates: true // Avoids errors if a number is already taken
      });
      
      return { pixCopyPaste, reservationId: `multiple-${buyer.id}` }; // Returning a mock/grouped ID
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const checkReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reservationId = parseInt(req.params.id, 10);
        if (isNaN(reservationId)) {
            throw new BadRequestError('Invalid reservation ID.');
        }

        // The schema uses ReservationPayment, so we query that.
        const reservation = await prisma.reservationPayment.findFirst({
            where: { id: reservationId },
            select: { status: true, expiresAt: true, number: true, raffle: { select: { name: true } } }
        });

        if (!reservation) {
            throw new NotFoundError('Reservation not found');
        }

        res.json({ success: true, reservation });
    } catch (error) {
        next(error);
    }
};
