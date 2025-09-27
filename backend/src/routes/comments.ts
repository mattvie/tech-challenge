import { Router } from 'express';
import { 
  getComments, 
  createComment, 
  updateComment, 
  deleteComment 
} from '../controllers/commentController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validateRequest, createCommentSchema, updateCommentSchema } from '../middleware/validation';

const router = Router();

router.get('/post/:postId', optionalAuth, getComments);

router.post('/', authenticateToken, validateRequest(createCommentSchema), createComment);
// Novo schema de validação
router.put('/:id', authenticateToken, validateRequest(updateCommentSchema), updateComment);
router.delete('/:id', authenticateToken, deleteComment);

export default router;
