import { Router } from 'express';
import { getRaffleBySlug, reserveNumbers } from '../controllers/publicController';

const router = Router();

router.get('/raffles/:slug', getRaffleBySlug);
router.post('/raffles/:slug/reserve', reserveNumbers);

export default router;
