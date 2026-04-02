"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlans = exports.createPlan = exports.toggleSubscriberStatus = exports.listSubscribers = exports.getDashboardInfo = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const errors_1 = require("../utils/errors");
const getDashboardInfo = async (req, res, next) => {
    try {
        const totalSubscribers = await prisma_1.default.user.count({ where: { role: 'SUBSCRIBER' } });
        const totalPlans = await prisma_1.default.platformPlan.count();
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
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardInfo = getDashboardInfo;
const listSubscribers = async (req, res, next) => {
    try {
        const subscribers = await prisma_1.default.user.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.listSubscribers = listSubscribers;
const toggleSubscriberStatus = async (req, res, next) => {
    try {
        const id = String(req.params.id);
        const { status } = req.body; // ACTIVE or BLOCKED
        const user = await prisma_1.default.user.findUnique({ where: { id } });
        if (!user)
            throw new errors_1.NotFoundError('Usuário não encontrado');
        const updated = await prisma_1.default.user.update({
            where: { id },
            data: { status }
        });
        res.json({ success: true, user: updated });
    }
    catch (error) {
        next(error);
    }
};
exports.toggleSubscriberStatus = toggleSubscriberStatus;
const createPlan = async (req, res, next) => {
    try {
        const { name, maxRaffles, price, cycle } = req.body;
        const plan = await prisma_1.default.platformPlan.create({
            data: { name, maxRaffles, price, cycle }
        });
        res.json({ success: true, plan });
    }
    catch (error) {
        next(error);
    }
};
exports.createPlan = createPlan;
const getPlans = async (req, res, next) => {
    try {
        const plans = await prisma_1.default.platformPlan.findMany();
        res.json({ success: true, plans });
    }
    catch (error) {
        next(error);
    }
};
exports.getPlans = getPlans;
