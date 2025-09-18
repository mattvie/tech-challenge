import { Router } from 'express';
import { uploadMemory, uploadImage, deleteImage } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes
router.post('/image', authenticateToken, uploadMemory, uploadImage);
router.delete('/image/:key', authenticateToken, deleteImage);

export default router;