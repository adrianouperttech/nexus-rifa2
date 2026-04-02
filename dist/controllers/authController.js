"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const errors_1 = require("../utils/errors");
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            throw new errors_1.BadRequestError('Nome, e-mail e senha são obrigatórios.');
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new errors_1.BadRequestError('E-mail já está em uso.');
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                // Ao registrar pela API pública, ele se torna SUBSCRIBER
                role: 'SUBSCRIBER',
            },
        });
        res.status(201).json({
            success: true,
            message: 'Usuário registrado com sucesso',
            user: { id: user.id, name: user.name, email: user.email }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new errors_1.BadRequestError('E-mail e senha são obrigatórios.');
        }
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            throw new errors_1.UnauthorizedError('Credenciais inválidas.');
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new errors_1.UnauthorizedError('Credenciais inválidas.');
        }
        if (user.status === 'BLOCKED') {
            throw new errors_1.UnauthorizedError('Sua conta foi bloqueada pelo administrador.');
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'supers3cr3tnexus', { expiresIn: '7d' });
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
