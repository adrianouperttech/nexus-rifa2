import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
    getDashboard,      // Corrected from getDashboardInfo
    listRaffles,       // Corrected from getRaffles
    createRaffle,
    updateRaffle,
    getRaffleDetails
} from '../controllers/subscriberController';

const router = Router();

// Apply auth middleware to all subscriber routes
router.use(authMiddleware);

router.get('/dashboard', getDashboard);
router.get('/raffles', listRaffles);
router.post('/raffles', createRaffle);
router.put('/raffles/:id', updateRaffle);
router.get('/raffles/:id', getRaffleDetails);

// Removed routes for buyPlan and updateSettings as they no longer exist.

export default router;
