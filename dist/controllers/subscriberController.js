"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaffles = exports.createRaffle = exports.updateSettings = exports.getDashboardInfo = exports.buyPlan = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errors_1 = require("../utils/errors");
const buyPlan = async (req, res, next) => {
    try {
        const { planId } = req.body;
        const userId = req.user.userId;
        const plan = await prisma_1.default.platformPlan.findUnique({ where: { id: planId } });
        if (!plan)
            throw new errors_1.NotFoundError('Plano não encontrado.');
        // Simulação da compra do plano (em produção usaria Stripe/Asaas/MercadoPago do ADMIN)
        const subscription = await prisma_1.default.subscription.create({
            data: {
                userId,
                planId,
                status: 'ACTIVE',
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
            }
        });
        res.json({ success: true, message: 'Plano atualizado', subscription });
    }
    catch (error) {
        next(error);
    }
};
exports.buyPlan = buyPlan;
const getDashboardInfo = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const raffles = await prisma_1.default.raffle.findMany({ where: { userId } });
        // Sum of paid reservations
        const reservations = await prisma_1.default.reservationPayment.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardInfo = getDashboardInfo;
const updateSettings = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { pixKey, whatsappToken } = req.body;
        const updated = await prisma_1.default.user.update({
            where: { id: userId },
            data: { pixKey, whatsappToken }
        });
        res.json({ success: true, user: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSettings = updateSettings;
const createRaffle = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { name, description, pricePerNumber, slug, totalNumbers } = req.body;
        const photoUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
        // TODO: Verify if user reached plan limit
        const activeSub = await prisma_1.default.subscription.findFirst({
            where: { userId, status: 'ACTIVE' },
            include: { plan: true }
        });
        if (!activeSub)
            throw new errors_1.BadRequestError('Você precisa de uma assinatura ativa.');
        const countRaffles = await prisma_1.default.raffle.count({ where: { userId } });
        if (countRaffles >= activeSub.plan.maxRaffles) {
            throw new errors_1.BadRequestError(`Seu plano permite apenas ${activeSub.plan.maxRaffles} rifas.`);
        }
        const _totalNumbers = parseInt(totalNumbers);
        const raffle = await prisma_1.default.raffle.create({
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
        await prisma_1.default.raffleNumber.createMany({
            data: numbersToInsert
        });
        res.status(201).json({ success: true, raffle });
    }
    catch (error) {
        next(error);
    }
};
exports.createRaffle = createRaffle;
const getRaffles = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const raffles = await prisma_1.default.raffle.findMany({ where: { userId } });
        res.json({ success: true, raffles });
    }
    catch (error) {
        next(error);
    }
};
exports.getRaffles = getRaffles;
