import { Router } from 'express';
import { DirectionsController } from '../controllers/directionsController';

const router = Router();
const directionsController = new DirectionsController();

// POST /api/directions - Get cycling directions
router.post('/', (req, res) => directionsController.getDirections(req, res));

export default router; 