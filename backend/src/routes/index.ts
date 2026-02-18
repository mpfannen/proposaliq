import { Router } from 'express';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'ProposalIQ API',
  });
});

// TODO: Add more routes here as needed
// Example:
// import proposalRoutes from './proposals';
// router.use('/proposals', proposalRoutes);

export default router;
