import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleCard } from '../components/vehicles/VehicleCard';
import { Vehicle } from '../types';

const mockVehicle: Vehicle = {
  _id: '507f1f77bcf86cd799439011',
  make: 'Toyota',
  model: 'Camry',
  category: 'Sedan',
  price: 28500,
  quantity: 5,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('VehicleCard', () => {
  it('renders vehicle details', () => {
    render(<VehicleCard vehicle={mockVehicle} onPurchase={vi.fn()} />);

    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('$28,500')).toBeInTheDocument();
    expect(screen.getByText('5 in stock')).toBeInTheDocument();
  });

  it('disables purchase button when out of stock', () => {
    const outOfStock = { ...mockVehicle, quantity: 0 };

    render(<VehicleCard vehicle={outOfStock} onPurchase={vi.fn()} />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Purchase' })).toBeDisabled();
  });

  it('calls onPurchase when purchase button is clicked', () => {
    const onPurchase = vi.fn();

    render(<VehicleCard vehicle={mockVehicle} onPurchase={onPurchase} />);

    fireEvent.click(screen.getByRole('button', { name: 'Purchase' }));

    expect(onPurchase).toHaveBeenCalledWith(mockVehicle._id);
  });

  it('shows processing state while purchasing', () => {
    render(
      <VehicleCard vehicle={mockVehicle} onPurchase={vi.fn()} purchasing />
    );

    expect(screen.getByRole('button', { name: 'Processing...' })).toBeDisabled();
  });
});
