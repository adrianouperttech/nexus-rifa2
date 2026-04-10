import { Router } from 'express';
import { listUsers, getUserDetails, updateUser } from '../controllers/adminController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Applying auth and admin guards to all routes in this file
router.use(authMiddleware);

// Routes that are valid based on the updated adminController
router.get('/users', listUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id', updateUser);

// Removed routes for getDashboardInfo, listSubscribers, toggleSubscriberStatus, createPlan, and getPlans
// as they do not exist in the controller anymore.

export default router;
