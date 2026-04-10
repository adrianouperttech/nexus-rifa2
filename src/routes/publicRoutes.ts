import { Router } from 'express';
import { getRaffleDetails, reserveNumbers, checkReservation } from '../controllers/publicController';

const router = Router();

// Corrected route to fetch by ID, not slug
router.get('/raffles/:id', getRaffleDetails);

// Route to reserve numbers for a raffle
router.post('/raffles/:id/reserve', reserveNumbers);

// Route to check the status of a reservation
router.get('/reservations/:id', checkReservation);

// The route for getRaffleBySlug was removed as the controller logic was updated to fetch by ID.

export default router;
