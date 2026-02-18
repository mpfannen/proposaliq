import { Request, Response } from 'express';
import ProposalModel, { OutcomeInput } from '../models/Proposal';
import KnowledgeBaseModel from '../models/KnowledgeBase';
import mammoth from 'mammoth';
import path from 'path';
import { generateProposalResponse } from '../services/claudeService';

// Import pdf-parse - get the default export
const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;

// Extract text from PDF
async function extractPDFText(buffer: Buffer): Promise<string> {
  console.log('🔵 Extracting text from PDF...');
  try {
    // pdfParse is a function that returns a promise
    const data: any = await (pdfParse as any)(buffer);
    console.log('✅ PDF text extracted, length:', data.text.length);
    return data.text;
  } catch (error: any) {
    console.error('❌ PDF extraction error:', error.message);
    throw new Error('Failed to extract text from PDF');
  }
}

// Extract text from Word document
async function extractWordText(buffer: Buffer): Promise<string> {
  console.log('🔵 Extracting text from Word document...');
  try {
    const result = await mammoth.extractRawText({ buffer });
    console.log('✅ Word text extracted, length:', result.value.length);
    return result.value;
  } catch (error: any) {
    console.error('❌ Word extraction error:', error.message);
    throw new Error('Failed to extract text from Word document');
  }
}

// @desc    Create new proposal with RFP upload
// @route   POST /api/proposals/create
// @access  Private
export const createProposal = async (req: Request, res: Response): Promise<void> => {
  console.log('🔵 Create proposal request received');

  try {
    // Check if file was uploaded
    if (!req.file) {
      console.log('❌ No file uploaded');
      res.status(400).json({ message: 'Please upload a file' });
      return;
    }

    // Get user ID from auth middleware
    const userId = (req as any).user?.id;
    if (!userId) {
      console.log('❌ User not authenticated');
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    console.log('🔵 File received:', req.file.originalname, 'Size:', req.file.size, 'bytes');

    // Determine file type and extract text
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    let extractedText: string;

    if (fileExt === '.pdf') {
      extractedText = await extractPDFText(req.file.buffer);
    } else if (fileExt === '.doc' || fileExt === '.docx') {
      extractedText = await extractWordText(req.file.buffer);
    } else {
      console.log('❌ Unsupported file type:', fileExt);
      res.status(400).json({ message: 'Unsupported file type. Please upload PDF or Word document.' });
      return;
    }

    // Create proposal in database
    const proposal = await ProposalModel.create({
      user_id: userId,
      rfp_filename: req.file.originalname,
      rfp_text: extractedText,
      status: 'draft',
    });

    console.log('✅ Proposal created successfully, ID:', proposal.id);

    res.status(201).json({
      success: true,
      message: 'Proposal created successfully',
      data: {
        proposal_id: proposal.id,
        filename: proposal.rfp_filename,
        text_length: extractedText.length,
        status: proposal.status,
        created_at: proposal.created_at,
      },
    });
  } catch (error: any) {
    console.error('❌ Create proposal error:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to create proposal',
      error: error.message,
    });
  }
};

// @desc    Get proposal by ID
// @route   GET /api/proposals/:id
// @access  Private
export const getProposal = async (req: Request, res: Response): Promise<void> => {
  try {
    const proposalId = parseInt(req.params.id as string);
    const userId = (req as any).user?.id;

    const proposal = await ProposalModel.findById(proposalId);

    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }

    // Check if proposal belongs to user
    if (proposal.user_id !== userId) {
      res.status(403).json({ message: 'Not authorized to view this proposal' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { proposal },
    });
  } catch (error: any) {
    console.error('❌ Get proposal error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve proposal',
    });
  }
};

// @desc    Get all proposals for current user
// @route   GET /api/proposals
// @access  Private
export const getUserProposals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;

    const proposals = await ProposalModel.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: proposals.length,
      data: { proposals },
    });
  } catch (error: any) {
    console.error('❌ Get user proposals error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve proposals',
    });
  }
};

// @desc    Update proposal (status or response text)
// @route   PUT /api/proposals/:id
// @access  Private
export const updateProposal = async (req: Request, res: Response): Promise<void> => {
  try {
    const proposalId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    const proposal = await ProposalModel.findById(proposalId);
    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }
    if (proposal.user_id !== userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const { status, proposal_response } = req.body;
    const updated = await ProposalModel.update(proposalId, { status, proposal_response });

    res.status(200).json({ success: true, data: { proposal: updated } });
  } catch (error: any) {
    console.error('❌ Update proposal error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update proposal' });
  }
};

// @desc    Delete proposal
// @route   DELETE /api/proposals/:id
// @access  Private
export const deleteProposal = async (req: Request, res: Response): Promise<void> => {
  try {
    const proposalId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    const proposal = await ProposalModel.findById(proposalId);
    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }
    if (proposal.user_id !== userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    await ProposalModel.delete(proposalId);
    res.status(200).json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error: any) {
    console.error('❌ Delete proposal error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete proposal' });
  }
};

// @desc    Generate AI proposal response using Claude
// @route   POST /api/proposals/:id/generate
// @access  Private
export const generateResponse = async (req: Request, res: Response): Promise<void> => {
  console.log('🔵 Generate response request received');

  try {
    const proposalId = parseInt(req.params.id as string);
    const userId = (req as any).user?.id;

    // Fetch the proposal
    const proposal = await ProposalModel.findById(proposalId);

    if (!proposal) {
      console.log('❌ Proposal not found');
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }

    // Check if proposal belongs to user
    if (proposal.user_id !== userId) {
      console.log('❌ User not authorized');
      res.status(403).json({ message: 'Not authorized to generate response for this proposal' });
      return;
    }

    // Check if RFP text exists
    if (!proposal.rfp_text || proposal.rfp_text.trim().length === 0) {
      console.log('❌ No RFP text available');
      res.status(400).json({ message: 'No RFP text available to generate response' });
      return;
    }

    // Update status to 'generating'
    await ProposalModel.update(proposalId, { status: 'generating' });

    // Fetch knowledge base documents for this user
    const kbDocs = await KnowledgeBaseModel.findByUserIdWithContent(userId);
    console.log(`📚 Found ${kbDocs.length} knowledge base document(s) to include`);

    console.log('🤖 Calling Claude AI service...');

    // Generate proposal response using Claude AI
    const result = await generateProposalResponse({
      rfpText: proposal.rfp_text,
      rfpFilename: proposal.rfp_filename,
      knowledgeBase: kbDocs.map((doc) => ({
        document_type: doc.document_type,
        filename: doc.filename,
        content: doc.content,
      })),
    });

    // Update proposal with generated response
    await ProposalModel.update(proposalId, {
      proposal_response: result.proposalResponse,
      status: 'completed',
    });

    console.log('✅ Response generated and saved successfully');

    res.status(200).json({
      success: true,
      message: 'Proposal response generated successfully',
      data: {
        proposal_id: proposalId,
        proposal_response: result.proposalResponse,
        tokens_used: result.tokensUsed,
        status: 'completed',
      },
    });
  } catch (error: any) {
    console.error('❌ Generate response error:', error.message);
    console.error('❌ Stack:', error.stack);

    // Try to update status back to 'draft' on error
    try {
      const proposalId = parseInt(req.params.id as string);
      await ProposalModel.update(proposalId, { status: 'draft' });
    } catch (updateError) {
      console.error('❌ Failed to update status after error:', updateError);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate proposal response',
      error: error.message,
    });
  }
};

// @desc    Update win/loss outcome for a proposal
// @route   PUT /api/proposals/:id/outcome
// @access  Private
export const updateOutcome = async (req: Request, res: Response): Promise<void> => {
  try {
    const proposalId = parseInt(req.params.id);
    const userId = (req as any).user?.id;
    const { outcome, contract_value, competitor_lost_to, loss_reason, loss_notes } = req.body;

    if (!['pending', 'won', 'lost'].includes(outcome)) {
      res.status(400).json({ message: 'Invalid outcome value. Must be pending, won, or lost.' });
      return;
    }

    const proposal = await ProposalModel.findById(proposalId);
    if (!proposal) {
      res.status(404).json({ message: 'Proposal not found' });
      return;
    }
    if (proposal.user_id !== userId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const outcomeData: OutcomeInput = {
      outcome,
      contract_value: contract_value != null ? parseFloat(contract_value) : null,
      competitor_lost_to: competitor_lost_to || null,
      loss_reason: loss_reason || null,
      loss_notes: loss_notes || null,
    };

    const updated = await ProposalModel.updateOutcome(proposalId, outcomeData);
    res.status(200).json({ success: true, data: { proposal: updated } });
  } catch (error: any) {
    console.error('❌ Update outcome error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update outcome' });
  }
};
