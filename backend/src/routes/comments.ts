import { Router } from 'express';
import { 
  getComments, 
  createComment, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validateRequest, createCommentSchema } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/post/:postId', optionalAuth, getComments);

// Protected routes
router.post('/', authenticateToken, validateRequest(createCommentSchema), createComment);
router.put('/:id', authenticateToken, updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;