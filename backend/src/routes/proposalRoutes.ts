import { Router } from 'express';
import { createProposal, getProposal, getUserProposals, updateProposal, deleteProposal, generateResponse, updateOutcome } from '../controllers/proposalController';
import { protect } from '../middleware/authMiddleware';
import { uploadRFP } from '../middleware/uploadMiddleware';

const router = Router();

// All routes are protected - user must be authenticated
router.use(protect);

// POST /api/proposals/create - Upload RFP and create proposal
router.post('/create', uploadRFP, createProposal);

// GET /api/proposals - Get all proposals for current user
router.get('/', getUserProposals);

// GET /api/proposals/:id - Get single proposal by ID
router.get('/:id', getProposal);

// PUT /api/proposals/:id/outcome - Update win/loss outcome
router.put('/:id/outcome', updateOutcome);

// PUT /api/proposals/:id - Update proposal
router.put('/:id', updateProposal);

// DELETE /api/proposals/:id - Delete proposal
router.delete('/:id', deleteProposal);

// POST /api/proposals/:id/generate - Generate AI response for proposal
router.post('/:id/generate', generateResponse);

export default router;
