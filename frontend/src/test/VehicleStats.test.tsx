import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VehicleStats } from '../components/vehicles/VehicleStats';
import { Vehicle } from '../types';

const mockVehicles: Vehicle[] = [
  {
    _id: '1',
    make: 'Toyota',
    model: 'Corolla',
    category: 'Sedan',
    year: 2023,
    price: 22000,
    quantity: 10,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    _id: '2',
    make: 'Ford',
    model: 'F-150',
    category: 'Truck',
    year: 2024,
    price: 45000,
    quantity: 5,
    createdAt: '2026-01-02',
    updatedAt: '2026-01-02',
  },
  {
    _id: '3',
    make: 'Tesla',
    model: 'Model Y',
    category: 'Electric',
    year: 2024,
    price: 50000,
    quantity: 0,
    createdAt: '2026-01-03',
    updatedAt: '2026-01-03',
  },
];

describe('VehicleStats', () => {
  it('renders correct inventory stats from vehicle array', () => {
    render(<VehicleStats vehicles={mockVehicles} />);

    // Total Models: 3
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Total Models')).toBeInTheDocument();

    // In Stock: 2 (Toyota Corolla and Ford F-150 have quantity > 0)
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();

    // Units Available: 15 (10 + 5 + 0)
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Units Available')).toBeInTheDocument();

    // Inventory Value: $445,000 (22000*10 + 45000*5 + 50000*0 = 220000 + 225000 = 445000)
    expect(screen.getByText('$445,000')).toBeInTheDocument();
    expect(screen.getByText('Inventory Value')).toBeInTheDocument();
  });
});
