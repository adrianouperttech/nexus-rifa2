import { Request, Response, NextFunction } from 'express';
import { getPrismaClient } from '../utils/prisma';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { Prisma } from '@prisma/client';

const prisma = getPrismaClient();

export const getRaffleBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = String(req.params.slug);
    const raffle = await prisma.raffle.findUnique({
      where: { slug },
      include: {
        numbers: true
      }
    });

    if (!raffle) throw new NotFoundError('Rifa não encontrada');

    res.json({ success: true, raffle });
  } catch (error) {
    next(error);
  }
};

export const reserveNumbers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slug = String(req.params.slug);
    const { name, email, whatsapp, selectedNumbers } = req.body;

    if (!Array.isArray(selectedNumbers) || selectedNumbers.length === 0) {
      throw new BadRequestError('Nenhum número selecionado');
    }

    const raffle = await prisma.raffle.findUnique({
      where: { slug },
      include: { user: true }
    });

    if (!raffle) throw new NotFoundError('Rifa não encontrada');

    const availableNumbers = await prisma.raffleNumber.findMany({
      where: {
        raffleId: raffle.id,
        number: { in: selectedNumbers },
        status: 'AVAILABLE'
      }
    });

    if (availableNumbers.length !== selectedNumbers.length) {
      throw new BadRequestError('Alguns ou todos os números selecionados já foram reservados');
    }

    const result = await prisma.$transaction(async (tx) => {
      let buyer = await tx.ticketBuyer.findFirst({ where: { email } });
      if (!buyer) {
        buyer = await tx.ticketBuyer.create({
          data: { name, email, whatsapp }
        });
      }

      const amountToPay = selectedNumbers.length * raffle.pricePerNumber;

      const payment = await tx.reservationPayment.create({
        data: {
          raffleId: raffle.id,
          buyerId: buyer.id,
          amount: amountToPay,
          status: 'PENDING',
          pixCopyPaste: '00020126580014br.gov.bcb.pix...',
          pixQrCode: 'base64qrcode...'
        }
      });

      await tx.raffleNumber.updateMany({
        where: {
          raffleId: raffle.id,
          number: { in: selectedNumbers }
        },
        data: {
          status: 'RESERVED',
          buyerId: buyer.id
        }
      });

      return payment;
    });

    res.json({ success: true, payment: result });
  } catch (error) {
    next(error);
  }
};
