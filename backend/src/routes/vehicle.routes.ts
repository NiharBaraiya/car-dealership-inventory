import { Router } from 'express';
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from '../controllers/vehicle.controller';
import { authenticate, requireAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createVehicleValidation,
  updateVehicleValidation,
  searchVehicleValidation,
  restockValidation,
} from '../validators/vehicle.validator';

const router = Router();

// All vehicle routes require authentication
router.use(authenticate);

router.get('/search', searchVehicleValidation, validate, searchVehicles);
router.get('/', getVehicles);
router.post('/', requireAdmin, createVehicleValidation, validate, createVehicle);
router.put('/:id', requireAdmin, updateVehicleValidation, validate, updateVehicle);
router.delete('/:id', requireAdmin, deleteVehicle);
router.post('/:id/purchase', purchaseVehicle);
router.post('/:id/restock', requireAdmin, restockValidation, validate, restockVehicle);

export default router;
