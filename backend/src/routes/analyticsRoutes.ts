import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

// GET /api/analytics
router.get('/', getAnalytics);

export default router;
