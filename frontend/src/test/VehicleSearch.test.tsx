import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleSearch } from '../components/vehicles/VehicleSearch';

describe('VehicleSearch', () => {
  it('calls onSearch with entered filter values', () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();

    render(<VehicleSearch onSearch={onSearch} onClear={onClear} />);

    fireEvent.change(screen.getByPlaceholderText('Make'), {
      target: { value: 'Toyota' },
    });
    fireEvent.change(screen.getByPlaceholderText('Model'), {
      target: { value: 'Camry' },
    });
    fireEvent.change(screen.getByPlaceholderText('Category'), {
      target: { value: 'Sedan' },
    });
    fireEvent.change(screen.getByPlaceholderText('Min Price'), {
      target: { value: '20000' },
    });
    fireEvent.change(screen.getByPlaceholderText('Max Price'), {
      target: { value: '30000' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith({
      make: 'Toyota',
      model: 'Camry',
      category: 'Sedan',
      minPrice: 20000,
      maxPrice: 30000,
    });
  });

  it('clears fields and calls onClear', () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();

    render(<VehicleSearch onSearch={onSearch} onClear={onClear} />);

    const makeInput = screen.getByPlaceholderText('Make');
    fireEvent.change(makeInput, { target: { value: 'Honda' } });
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onClear).toHaveBeenCalled();
    expect(makeInput).toHaveValue('');
  });
});
