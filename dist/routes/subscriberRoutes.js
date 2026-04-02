"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middlewares/auth");
const subscriberController_1 = require("../controllers/subscriberController");
// Multer photo upload config (local temp storage)
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken);
router.use(auth_1.requireSubscriber);
router.post('/plan/buy', subscriberController_1.buyPlan);
router.get('/dashboard', subscriberController_1.getDashboardInfo);
router.put('/settings', subscriberController_1.updateSettings);
router.get('/raffles', subscriberController_1.getRaffles);
router.post('/raffles', upload.single('photo'), subscriberController_1.createRaffle);
exports.default = router;
