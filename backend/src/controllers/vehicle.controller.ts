import { Response, NextFunction } from 'express';
import { vehicleService } from '../services/vehicle.service';
import { asyncHandler } from '../utils/errors';
import { AuthenticatedRequest, VehicleSearchQuery } from '../types';

export const createVehicle = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const vehicle = await vehicleService.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  }
);

export const getVehicles = asyncHandler(
  async (_req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const vehicles = await vehicleService.getAll();
    res.status(200).json({ success: true, data: vehicles });
  }
);

export const searchVehicles = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const query: VehicleSearchQuery = {
      make: req.query.make as string | undefined,
      model: req.query.model as string | undefined,
      category: req.query.category as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };

    const vehicles = await vehicleService.search(query);
    res.status(200).json({ success: true, data: vehicles });
  }
);

export const updateVehicle = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const vehicle = await vehicleService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data: vehicle });
  }
);

export const deleteVehicle = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    await vehicleService.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Vehicle deleted successfully' });
  }
);

export const purchaseVehicle = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const vehicle = await vehicleService.purchase(req.params.id);
    res.status(200).json({ success: true, data: vehicle });
  }
);

export const restockVehicle = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    const vehicle = await vehicleService.restock(req.params.id, req.body.amount);
    res.status(200).json({ success: true, data: vehicle });
  }
);
