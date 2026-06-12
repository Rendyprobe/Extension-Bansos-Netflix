import express from 'express';
import * as userController from '../controllers/userController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, userController.getAll);
router.delete('/:id', verifyToken, verifyAdmin, userController.deleteUser);

export default router;
