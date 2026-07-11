import bcrypt from 'bcryptjs';
import { authService } from '../../src/services/auth.service';
import { User } from '../../src/models/User';
import { AppError } from '../../src/utils/errors';

describe('AuthService', () => {
  describe('register', () => {
    it('should register a new user and return a token', async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.role).toBe('user');
    });

    it('should throw error if email already exists', async () => {
      await authService.register({
        email: 'duplicate@example.com',
        password: 'password123',
        name: 'User One',
      });

      await expect(
        authService.register({
          email: 'duplicate@example.com',
          password: 'password456',
          name: 'User Two',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        email: 'login@example.com',
        password: hashedPassword,
        name: 'Login User',
        role: 'user',
      });
    });

    it('should login with valid credentials', async () => {
      const result = await authService.login({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('login@example.com');
    });

    it('should throw error with invalid password', async () => {
      await expect(
        authService.login({
          email: 'login@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AppError);
    });

    it('should throw error with non-existent email', async () => {
      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(AppError);
    });
  });
});
