"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reserveNumbers = exports.getRaffleBySlug = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errors_1 = require("../utils/errors");
const getRaffleBySlug = async (req, res, next) => {
    try {
        const slug = String(req.params.slug);
        const raffle = await prisma_1.default.raffle.findUnique({
            where: { slug },
            include: {
                numbers: true // could be paginated or summarized if numbers are huge
            }
        });
        if (!raffle)
            throw new errors_1.NotFoundError('Rifa não encontrada');
        res.json({ success: true, raffle });
    }
    catch (error) {
        next(error);
    }
};
exports.getRaffleBySlug = getRaffleBySlug;
const reserveNumbers = async (req, res, next) => {
    try {
        const slug = String(req.params.slug);
        const { name, email, whatsapp, selectedNumbers } = req.body;
        if (!Array.isArray(selectedNumbers) || selectedNumbers.length === 0) {
            throw new errors_1.BadRequestError('Nenhum número selecionado');
        }
        const raffle = await prisma_1.default.raffle.findUnique({
            where: { slug },
            include: { user: true }
        });
        if (!raffle)
            throw new errors_1.NotFoundError('Rifa não encontrada');
        // Verify if numbers are available
        const availableNumbers = await prisma_1.default.raffleNumber.findMany({
            where: {
                raffleId: raffle.id,
                number: { in: selectedNumbers },
                status: 'AVAILABLE'
            }
        });
        if (availableNumbers.length !== selectedNumbers.length) {
            throw new errors_1.BadRequestError('Alguns ou todos os números selecionados já foram reservados');
        }
        // Process Transaction
        const result = await prisma_1.default.$transaction(async (tx) => {
            // Find or create buyer
            let buyer = await tx.ticketBuyer.findFirst({ where: { email } });
            if (!buyer) {
                buyer = await tx.ticketBuyer.create({
                    data: { name, email, whatsapp }
                });
            }
            const amountToPay = selectedNumbers.length * raffle.pricePerNumber;
            // Create Payment
            const payment = await tx.reservationPayment.create({
                data: {
                    raffleId: raffle.id,
                    buyerId: buyer.id,
                    amount: amountToPay,
                    status: 'PENDING',
                    // Simulando PIX gerado (em prod enviaria req pra API MercadoPago do recebedor `raffle.user.pixKey`)
                    pixCopyPaste: '00020126580014br.gov.bcb.pix...',
                    pixQrCode: 'base64qrcode...'
                }
            });
            // Update numbers
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
    }
    catch (error) {
        next(error);
    }
};
exports.reserveNumbers = reserveNumbers;
