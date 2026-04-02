import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/auth';
import { 
  getDashboardInfo, listSubscribers, toggleSubscriberStatus, createPlan, getPlans 
} from '../controllers/adminController';

const router = Router();

router.use(authenticateToken);
router.use(requireAdmin);

router.get('/dashboard', getDashboardInfo);
router.get('/subscribers', listSubscribers);
router.patch('/subscribers/:id/status', toggleSubscriberStatus);

router.post('/plans', createPlan);
router.get('/plans', getPlans);

export default router;
