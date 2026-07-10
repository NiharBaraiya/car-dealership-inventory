import { vehicleService } from '../../src/services/vehicle.service';
import { AppError } from '../../src/utils/errors';

describe('VehicleService', () => {
  const sampleVehicle = {
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 5,
  };

  describe('create', () => {
    it('should create a new vehicle', async () => {
      const vehicle = await vehicleService.create(sampleVehicle);

      expect(vehicle.make).toBe('Toyota');
      expect(vehicle.model).toBe('Camry');
      expect(vehicle.quantity).toBe(5);
    });
  });

  describe('getAll', () => {
    it('should return all vehicles', async () => {
      await vehicleService.create(sampleVehicle);
      await vehicleService.create({ ...sampleVehicle, make: 'Honda', model: 'Civic' });

      const vehicles = await vehicleService.getAll();
      expect(vehicles).toHaveLength(2);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await vehicleService.create(sampleVehicle);
      await vehicleService.create({
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        price: 22000,
        quantity: 3,
      });
      await vehicleService.create({
        make: 'Ford',
        model: 'F-150',
        category: 'Truck',
        price: 45000,
        quantity: 2,
      });
    });

    it('should search by make', async () => {
      const results = await vehicleService.search({ make: 'Toyota' });
      expect(results).toHaveLength(1);
      expect(results[0].make).toBe('Toyota');
    });

    it('should search by price range', async () => {
      const results = await vehicleService.search({ minPrice: 20000, maxPrice: 30000 });
      expect(results).toHaveLength(2);
    });

    it('should search by category', async () => {
      const results = await vehicleService.search({ category: 'Truck' });
      expect(results).toHaveLength(1);
      expect(results[0].make).toBe('Ford');
    });
  });

  describe('purchase', () => {
    it('should decrease quantity by 1', async () => {
      const vehicle = await vehicleService.create(sampleVehicle);
      const purchased = await vehicleService.purchase(vehicle._id.toString());

      expect(purchased.quantity).toBe(4);
    });

    it('should throw error when out of stock', async () => {
      const vehicle = await vehicleService.create({ ...sampleVehicle, quantity: 0 });

      await expect(
        vehicleService.purchase(vehicle._id.toString())
      ).rejects.toThrow(AppError);
    });
  });

  describe('restock', () => {
    it('should increase quantity', async () => {
      const vehicle = await vehicleService.create(sampleVehicle);
      const restocked = await vehicleService.restock(vehicle._id.toString(), 10);

      expect(restocked.quantity).toBe(15);
    });
  });

  describe('update', () => {
    it('should update vehicle fields', async () => {
      const vehicle = await vehicleService.create(sampleVehicle);
      const updated = await vehicleService.update(vehicle._id.toString(), {
        price: 26000,
        quantity: 10,
      });

      expect(updated.price).toBe(26000);
      expect(updated.quantity).toBe(10);
    });

    it('should throw error when vehicle not found', async () => {
      await expect(
        vehicleService.update('507f1f77bcf86cd799439011', { price: 30000 })
      ).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete a vehicle', async () => {
      const vehicle = await vehicleService.create(sampleVehicle);
      await vehicleService.delete(vehicle._id.toString());

      await expect(
        vehicleService.getById(vehicle._id.toString())
      ).rejects.toThrow(AppError);
    });
  });
});
