import { describe, it, expect } from 'vitest';
import { formatPrice, getVehicleImageUrl, sortVehicles, getVehicleStats } from '../utils/vehicle';
import { Vehicle } from '../types';

describe('Vehicle Utilities', () => {
  describe('formatPrice', () => {
    it('formats numbers into USD currency format without cents', () => {
      expect(formatPrice(12345)).toBe('$12,345');
      expect(formatPrice(0)).toBe('$0');
      expect(formatPrice(999999.99)).toBe('$1,000,000');
    });
  });

  describe('getVehicleImageUrl', () => {
    it('returns the placeholder image when no image URL is provided', () => {
      expect(getVehicleImageUrl()).toBe('/placeholder-car.svg');
      expect(getVehicleImageUrl('')).toBe('/placeholder-car.svg');
    });

    it('returns the URL as-is if it is an external URL, blob link, or data URL', () => {
      expect(getVehicleImageUrl('http://example.com/car.jpg')).toBe('http://example.com/car.jpg');
      expect(getVehicleImageUrl('https://example.com/car.jpg')).toBe('https://example.com/car.jpg');
      expect(getVehicleImageUrl('blob:http://localhost/test-uuid')).toBe('blob:http://localhost/test-uuid');
      expect(getVehicleImageUrl('data:image/png;base64,123')).toBe('data:image/png;base64,123');
    });

    it('appends relative imageUrl paths to the backend API URL', () => {
      const result = getVehicleImageUrl('/uploads/vehicles/car.jpg');
      expect(result).toContain('/uploads/vehicles/car.jpg');
    });
  });

  describe('sortVehicles', () => {
    const mockVehicles: Vehicle[] = [
      {
        _id: '1',
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        year: 2022,
        price: 22000,
        quantity: 2,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        _id: '2',
        make: 'Toyota',
        model: 'Tundra',
        category: 'Truck',
        year: 2024,
        price: 45000,
        quantity: 3,
        createdAt: '2026-01-03T00:00:00.000Z',
        updatedAt: '2026-01-03T00:00:00.000Z',
      },
      {
        _id: '3',
        make: 'Ford',
        model: 'Mustang',
        category: 'Sports',
        year: 2023,
        price: 35000,
        quantity: 0,
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      },
    ];

    it('sorts vehicles by price ascending', () => {
      const sorted = sortVehicles(mockVehicles, 'price-asc');
      expect(sorted[0]._id).toBe('1');
      expect(sorted[1]._id).toBe('3');
      expect(sorted[2]._id).toBe('2');
    });

    it('sorts vehicles by price descending', () => {
      const sorted = sortVehicles(mockVehicles, 'price-desc');
      expect(sorted[0]._id).toBe('2');
      expect(sorted[1]._id).toBe('3');
      expect(sorted[2]._id).toBe('1');
    });

    it('sorts vehicles by name (make model) alphabetically', () => {
      const sorted = sortVehicles(mockVehicles, 'name-asc');
      expect(sorted[0].make).toBe('Ford');
      expect(sorted[1].make).toBe('Honda');
      expect(sorted[2].make).toBe('Toyota');
    });

    it('sorts vehicles by newest creation date first', () => {
      const sorted = sortVehicles(mockVehicles, 'newest');
      expect(sorted[0]._id).toBe('2');
      expect(sorted[1]._id).toBe('3');
      expect(sorted[2]._id).toBe('1');
    });
  });

  describe('getVehicleStats', () => {
    const mockVehicles: Vehicle[] = [
      {
        _id: '1',
        make: 'Honda',
        model: 'Civic',
        category: 'Sedan',
        year: 2022,
        price: 20000,
        quantity: 5,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      {
        _id: '2',
        make: 'Toyota',
        model: 'Tundra',
        category: 'Truck',
        year: 2024,
        price: 50000,
        quantity: 2,
        createdAt: '2026-01-03',
        updatedAt: '2026-01-03',
      },
      {
        _id: '3',
        make: 'Ford',
        model: 'Mustang',
        category: 'Sports',
        year: 2023,
        price: 40000,
        quantity: 0,
        createdAt: '2026-01-02',
        updatedAt: '2026-01-02',
      },
    ];

    it('correctly calculates vehicle metrics from inventory array', () => {
      const stats = getVehicleStats(mockVehicles);
      expect(stats.total).toBe(3);
      expect(stats.inStock).toBe(2);
      expect(stats.outOfStock).toBe(1);
      expect(stats.totalUnits).toBe(7);
      expect(stats.totalValue).toBe(200000);
      expect(stats.categories).toBe(3);
    });
  });
});
