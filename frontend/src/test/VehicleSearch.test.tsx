import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VehicleSearch } from '../components/vehicles/VehicleSearch';

describe('VehicleSearch', () => {
  it('calls onSearch with entered filter values', () => {
    const onSearch = vi.fn();
    const onClear = vi.fn();
    const onSortChange = vi.fn();

    render(
      <VehicleSearch
        onSearch={onSearch}
        onClear={onClear}
        sort="newest"
        onSortChange={onSortChange}
      />
    );

    fireEvent.change(screen.getByLabelText('Make'), {
      target: { value: 'Toyota' },
    });
    fireEvent.change(screen.getByLabelText('Model'), {
      target: { value: 'Camry' },
    });
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Sedan' },
    });
    fireEvent.change(screen.getByLabelText('Min Price'), {
      target: { value: '20000' },
    });
    fireEvent.change(screen.getByLabelText('Max Price'), {
      target: { value: '30000' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Search Inventory' }));

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
    const onSortChange = vi.fn();

    render(
      <VehicleSearch
        onSearch={onSearch}
        onClear={onClear}
        sort="newest"
        onSortChange={onSortChange}
      />
    );

    const makeInput = screen.getByLabelText('Make');
    fireEvent.change(makeInput, { target: { value: 'Honda' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reset Filters' }));

    expect(onClear).toHaveBeenCalled();
    expect(makeInput).toHaveValue('');
  });
});
