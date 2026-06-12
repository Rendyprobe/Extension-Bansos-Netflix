import express from 'express';
import * as bahanController from '../controllers/bahanController.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes (auth required)
router.get('/', verifyToken, bahanController.getAll);
router.get('/:id', verifyToken, bahanController.getById);

// Admin routes
router.post('/', verifyToken, verifyAdmin, bahanController.create);
router.put('/:id', verifyToken, verifyAdmin, bahanController.update);
router.delete('/:id', verifyToken, verifyAdmin, bahanController.deleteOne);
router.post('/bulk-upload', verifyToken, verifyAdmin, bahanController.bulkUpload);
router.post('/bulk-delete', verifyToken, verifyAdmin, bahanController.bulkDelete);

export default router;
