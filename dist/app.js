"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const subscriberRoutes_1 = __importDefault(require("./routes/subscriberRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static mock uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
app.get('/ping', (req, res) => {
    res.json({ message: 'pong', api: 'Nexus-Rifa' });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/subscriber', subscriberRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
