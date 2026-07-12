import { Response, NextFunction } from 'express';
import { authenticate, requireAdmin } from '../../src/middleware/auth.middleware';
import * as jwtUtils from '../../src/utils/jwt';
import { AuthenticatedRequest } from '../../src/types';
import { AppError } from '../../src/utils/errors';

jest.mock('../../src/utils/jwt');

describe('Auth Middleware', () => {
  let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate a valid token and call next', () => {
      req.headers!.authorization = 'Bearer validtoken';
      const mockPayload = { userId: '123', email: 'test@example.com', role: 'user' as const };
      (jwtUtils.verifyToken as jest.Mock).mockReturnValue(mockPayload);

      authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(jwtUtils.verifyToken).toHaveBeenCalledWith('validtoken');
      expect(req.user).toEqual(mockPayload);
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with 401 error if authorization header is missing', () => {
      authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should call next with 401 error if authorization header does not start with Bearer', () => {
      req.headers!.authorization = 'Basic token';

      authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Authentication required');
    });

    it('should call next with 401 error if verifyToken throws', () => {
      req.headers!.authorization = 'Bearer invalidtoken';
      (jwtUtils.verifyToken as jest.Mock).mockImplementation(() => {
        throw new Error('JWT error');
      });

      authenticate(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.message).toBe('Invalid or expired token');
    });
  });

  describe('requireAdmin', () => {
    it('should allow access if user is admin', () => {
      req.user = { userId: '123', email: 'admin@example.com', role: 'admin' };

      requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access (403) if user is not admin', () => {
      req.user = { userId: '123', email: 'user@example.com', role: 'user' };

      requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Admin access required');
    });

    it('should deny access (403) if req.user is undefined', () => {
      req.user = undefined;

      requireAdmin(req as AuthenticatedRequest, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Admin access required');
    });
  });
});
