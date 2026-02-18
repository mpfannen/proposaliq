import { Request, Response } from 'express';
import path from 'path';
import mammoth from 'mammoth';
import KnowledgeBaseModel from '../models/KnowledgeBase';

const pdfParseModule = require('pdf-parse');
const pdfParse = pdfParseModule.default || pdfParseModule;

async function extractText(buffer: Buffer, filename: string): Promise<string> {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') {
    const data = await (pdfParse as any)(buffer);
    return data.text;
  } else if (ext === '.doc' || ext === '.docx') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (ext === '.md') {
    return buffer.toString('utf-8');
  }
  throw new Error('Unsupported file type');
}

const VALID_TYPES = ['general', 'company_overview', 'case_study', 'pricing', 'team_bio', 'capability_statement'];

// @desc    Upload a knowledge base document
// @route   POST /api/knowledge-base/upload
// @access  Private
export const uploadDocument = async (req: Request, res: Response): Promise<void> => {
  console.log('🔵 Knowledge base upload request received');

  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a file' });
      return;
    }

    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const documentType = req.body.document_type || 'general';
    if (!VALID_TYPES.includes(documentType)) {
      res.status(400).json({ message: `Invalid document type. Must be one of: ${VALID_TYPES.join(', ')}` });
      return;
    }

    console.log('🔵 Extracting text from:', req.file.originalname);
    const content = await extractText(req.file.buffer, req.file.originalname);

    if (!content || content.trim().length === 0) {
      res.status(400).json({ message: 'Could not extract text from the document' });
      return;
    }

    const doc = await KnowledgeBaseModel.create({
      user_id: userId,
      filename: req.file.originalname,
      document_type: documentType,
      content,
      file_size: req.file.size,
    });

    console.log('✅ Knowledge base document saved, ID:', doc.id);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id: doc.id,
        filename: doc.filename,
        document_type: doc.document_type,
        file_size: doc.file_size,
        created_at: doc.created_at,
      },
    });
  } catch (error: any) {
    console.error('❌ Knowledge base upload error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to upload document', error: error.message });
  }
};

// @desc    Get all knowledge base documents for current user
// @route   GET /api/knowledge-base
// @access  Private
export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const docs = await KnowledgeBaseModel.findByUserId(userId);

    res.status(200).json({
      success: true,
      count: docs.length,
      data: { documents: docs },
    });
  } catch (error: any) {
    console.error('❌ Get knowledge base error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve documents' });
  }
};

// @desc    Delete a knowledge base document
// @route   DELETE /api/knowledge-base/:id
// @access  Private
export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const docId = parseInt(req.params.id);
    const userId = (req as any).user?.id;

    const deleted = await KnowledgeBaseModel.delete(docId, userId);

    if (!deleted) {
      res.status(404).json({ message: 'Document not found or not authorized' });
      return;
    }

    console.log('✅ Knowledge base document deleted, ID:', docId);
    res.status(200).json({ success: true, message: 'Document deleted successfully' });
  } catch (error: any) {
    console.error('❌ Delete knowledge base error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete document' });
  }
};
