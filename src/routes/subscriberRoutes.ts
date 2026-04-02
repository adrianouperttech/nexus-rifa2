import { Router } from 'express';
import multer from 'multer';
import { authenticateToken, requireSubscriber } from '../middlewares/auth';
import { 
  buyPlan, getDashboardInfo, updateSettings, createRaffle, getRaffles 
} from '../controllers/subscriberController';

// Multer photo upload config (local temp storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const router = Router();

router.use(authenticateToken);
router.use(requireSubscriber);

router.post('/plan/buy', buyPlan);
router.get('/dashboard', getDashboardInfo);
router.put('/settings', updateSettings);

router.get('/raffles', getRaffles);
router.post('/raffles', upload.single('photo'), createRaffle);

export default router;
