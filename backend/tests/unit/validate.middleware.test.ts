import { Request, Response, NextFunction } from 'express';
import { validate, errorHandler } from '../../src/middleware/validate.middleware';
import { AppError } from '../../src/utils/errors';
import { validationResult } from 'express-validator';

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}));

describe('Validate Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should call next if validationResult has no errors', () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      validate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with AppError 400 if validationResult has errors', () => {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [
          { msg: 'Invalid email' },
          { msg: 'Password must be at least 6 characters' },
        ],
      });

      validate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe('Invalid email, Password must be at least 6 characters');
    });
  });

  describe('errorHandler', () => {
    it('should handle AppError and return error details', () => {
      const error = new AppError('Custom test error', 404);

      errorHandler(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Custom test error',
      });
    });

    it('should handle generic Error, log it, and return 500 Internal server error', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Database connection failed');

      errorHandler(error, req as Request, res as Response, next);

      expect(consoleSpy).toHaveBeenCalledWith('Unhandled error:', error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });

      consoleSpy.mockRestore();
    });
  });
});
