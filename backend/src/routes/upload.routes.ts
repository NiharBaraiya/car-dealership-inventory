import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { uploadVehicleImage } from '../middleware/upload.middleware';

const router = Router();

router.post(
  '/image',
  authenticate,
  requireAdmin,
  uploadVehicleImage.single('image'),
  uploadImage
);

export default router;
