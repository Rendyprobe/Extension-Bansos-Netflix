import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', verifyToken, authController.getCurrentUser);

export default router;
