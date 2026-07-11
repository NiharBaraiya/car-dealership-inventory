import { Response, NextFunction, Request } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/errors';

export const register = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  }
);
