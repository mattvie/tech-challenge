import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest, registerSchema, loginSchema, updateProfileSchema } from '../middleware/validation';

const router = Router();

// Essas rotas já tem validação
router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

router.get('/profile', authenticateToken, getProfile);
// Novo schema de validação adicionado
router.put('/profile', authenticateToken, validateRequest(updateProfileSchema), updateProfile);

export default router;
