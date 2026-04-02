"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const router = (0, express_1.Router)();
router.get('/raffles/:slug', publicController_1.getRaffleBySlug);
router.post('/raffles/:slug/reserve', publicController_1.reserveNumbers);
exports.default = router;
