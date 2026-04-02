"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSubscriber = exports.requireAdmin = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next(new errors_1.UnauthorizedError('Acesso Negado. Token não fornecido.'));
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'supers3cr3tnexus');
        req.user = verified;
        next();
    }
    catch (error) {
        return next(new errors_1.ForbiddenError('Token inválido ou expirado.'));
    }
};
exports.authenticateToken = authenticateToken;
const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'ADMIN') {
        return next(new errors_1.ForbiddenError('Acesso negado. Apenas administradores.'));
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireSubscriber = (req, res, next) => {
    if (req.user?.role !== 'SUBSCRIBER') {
        return next(new errors_1.ForbiddenError('Acesso negado. Apenas assinantes.'));
    }
    next();
};
exports.requireSubscriber = requireSubscriber;
