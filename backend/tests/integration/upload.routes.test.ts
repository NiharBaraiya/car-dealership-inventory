import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import { User } from '../../src/models/User';
import { generateToken } from '../../src/utils/jwt';
import path from 'path';
import fs from 'fs';

describe('Upload Routes', () => {
  let userToken: string;
  let adminToken: string;
  const createdFiles: string[] = [];

  beforeEach(async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await User.create({
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Regular User',
      role: 'user',
    });

    const admin = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });

    userToken = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    adminToken = generateToken({
      userId: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });
  });

  afterEach(() => {
    // Clean up any files that were uploaded during testing
    for (const file of createdFiles) {
      const filePath = path.join(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete test file: ${filePath}`, err);
        }
      }
    }
    createdFiles.length = 0;
  });

  describe('POST /api/upload/image', () => {
    it('should allow admin to upload a valid image', async () => {
      const dummyBuffer = Buffer.from('fake-image-content-for-test');
      
      const res = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('image', dummyBuffer, 'test-car.jpg');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.imageUrl).toBeDefined();
      expect(res.body.data.imageUrl).toContain('/uploads/vehicles/vehicle-');

      // Track file for cleanup
      createdFiles.push(res.body.data.imageUrl);
    });

    it('should return 400 if no image file is provided', async () => {
      const res = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(); // No attachment

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('No image file provided');
    });

    it('should deny upload from regular user', async () => {
      const dummyBuffer = Buffer.from('fake-image-content-for-test');
      
      const res = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${userToken}`)
        .attach('image', dummyBuffer, 'test-car.jpg');

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Admin access required');
    });

    it('should deny upload from unauthenticated request', async () => {
      const dummyBuffer = Buffer.from('fake-image-content-for-test');
      
      const res = await request(app)
        .post('/api/upload/image')
        .attach('image', dummyBuffer, 'test-car.jpg');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Authentication required');
    });

    it('should return error for invalid file extensions', async () => {
      const dummyBuffer = Buffer.from('fake-text-content');
      
      const res = await request(app)
        .post('/api/upload/image')
        .set('Authorization', `Bearer ${adminToken}`)
        .attach('image', dummyBuffer, 'test-car.txt');

      // For multer validation errors, the middleware throws Error, which triggers 500 error handler
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
    });
  });
});
