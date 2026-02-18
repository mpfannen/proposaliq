import { Router } from 'express';
import { uploadDocument, getDocuments, deleteDocument } from '../controllers/knowledgeBaseController';
import { protect } from '../middleware/authMiddleware';
import { kbUpload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(protect);

router.post('/upload', kbUpload.single('kb_file'), uploadDocument);
router.get('/', getDocuments);
router.delete('/:id', deleteDocument);

export default router;
