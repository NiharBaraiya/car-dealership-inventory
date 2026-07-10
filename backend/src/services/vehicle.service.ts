import { Vehicle } from '../models/Vehicle';
import { AppError } from '../utils/errors';
import { VehicleSearchQuery } from '../types';

interface CreateVehicleInput {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

interface UpdateVehicleInput {
  make?: string;
  model?: string;
  category?: string;
  price?: number;
  quantity?: number;
}

export const vehicleService = {
  async create(input: CreateVehicleInput) {
    return Vehicle.create(input);
  },

  async getAll() {
    return Vehicle.find().sort({ createdAt: -1 });
  },

  async search(query: VehicleSearchQuery) {
    const filter: Record<string, unknown> = {};

    if (query.make) {
      filter.make = { $regex: query.make, $options: 'i' };
    }
    if (query.model) {
      filter.model = { $regex: query.model, $options: 'i' };
    }
    if (query.category) {
      filter.category = { $regex: query.category, $options: 'i' };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) {
        (filter.price as Record<string, number>).$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        (filter.price as Record<string, number>).$lte = query.maxPrice;
      }
    }

    return Vehicle.find(filter).sort({ createdAt: -1 });
  },

  async getById(id: string) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicle;
  },

  async update(id: string, input: UpdateVehicleInput) {
    const vehicle = await Vehicle.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicle;
  },

  async delete(id: string) {
    const vehicle = await Vehicle.findByIdAndDelete(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    return vehicle;
  },

  async purchase(id: string) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }
    if (vehicle.quantity <= 0) {
      throw new AppError('Vehicle is out of stock', 400);
    }

    vehicle.quantity -= 1;
    await vehicle.save();
    return vehicle;
  },

  async restock(id: string, amount: number) {
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    vehicle.quantity += amount;
    await vehicle.save();
    return vehicle;
  },
};
