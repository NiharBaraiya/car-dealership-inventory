import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';
import { User } from '../../src/models/User';
import { Vehicle } from '../../src/models/Vehicle';
import { generateToken } from '../../src/utils/jwt';

describe('Vehicle Routes', () => {
  let userToken: string;
  let adminToken: string;
  let vehicleId: string;

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

    const vehicle = await Vehicle.create({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      year: 2024,
      price: 25000,
      quantity: 5,
    });
    vehicleId = vehicle._id.toString();
  });

  describe('GET /api/vehicles', () => {
    it('should return vehicles for authenticated user', async () => {
      const res = await request(app)
        .get('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/vehicles');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/vehicles', () => {
    it('should allow admin to create vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          make: 'Honda',
          model: 'Accord',
          category: 'Sedan',
          year: 2024,
          price: 28000,
          quantity: 3,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.make).toBe('Honda');
    });

    it('should deny regular user from creating vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          make: 'Honda',
          model: 'Accord',
          category: 'Sedan',
          year: 2024,
          price: 28000,
          quantity: 3,
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/vehicles/search', () => {
    it('should search vehicles by make', async () => {
      const res = await request(app)
        .get('/api/vehicles/search')
        .query({ make: 'Toyota' })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].make).toBe('Toyota');
    });

    it('should search vehicles by price range', async () => {
      await Vehicle.create({
        make: 'BMW',
        model: 'X5',
        category: 'SUV',
        year: 2024,
        price: 60000,
        quantity: 2,
      });

      const res = await request(app)
        .get('/api/vehicles/search')
        .query({ minPrice: 50000, maxPrice: 70000 })
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].make).toBe('BMW');
    });
  });

  describe('PUT /api/vehicles/:id', () => {
    it('should allow admin to update vehicle', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 27000 });

      expect(res.status).toBe(200);
      expect(res.body.data.price).toBe(27000);
    });

    it('should deny regular user from updating', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 27000 });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    it('should decrease quantity on purchase', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(4);
    });

    it('should return 400 when out of stock', async () => {
      await Vehicle.findByIdAndUpdate(vehicleId, { quantity: 0 });

      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    it('should allow admin to restock vehicle', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ amount: 10 });

      expect(res.status).toBe(200);
      expect(res.body.data.quantity).toBe(15);
    });

    it('should deny regular user from restocking', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ amount: 10 });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/vehicles/:id', () => {
    it('should allow admin to delete vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('should deny regular user from deleting', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });
  });
});
