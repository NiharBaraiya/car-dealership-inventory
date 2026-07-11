import { Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/errors';
import { AuthenticatedRequest } from '../types';

export const uploadImage = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No image file provided' });
      return;
    }

    const imageUrl = `/uploads/vehicles/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: { imageUrl },
    });
  }
);
