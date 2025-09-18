import { Router } from 'express';
import { 
  getPosts, 
  getPostById, 
  createPost, 
  updatePost, 
  deletePost, 
  likePost 
} from '../controllers/postController';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { validateRequest, createPostSchema, updatePostSchema } from '../middleware/validation';

const router = Router();

// Public routes (with optional authentication)
router.get('/', optionalAuth, getPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected routes
router.post('/', authenticateToken, validateRequest(createPostSchema), createPost);
router.put('/:id', authenticateToken, validateRequest(updatePostSchema), updatePost);
router.delete('/:id', authenticateToken, deletePost);
router.post('/:id/like', authenticateToken, likePost);

export default router;