import { FormEvent, useState } from 'react';
import { VehicleSearchParams } from '../../types';
import { Button } from '../ui/Button';

interface VehicleSearchProps {
  onSearch: (params: VehicleSearchParams) => void;
  onClear: () => void;
}

export const VehicleSearch = ({ onSearch, onClear }: VehicleSearchProps) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch({
      make: make || undefined,
      model: model || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleClear = () => {
    setMake('');
    setModel('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    onClear();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-fields">
        <input
          type="text"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
        />
      </div>
      <div className="search-actions">
        <Button type="submit">Search</Button>
        <Button type="button" variant="secondary" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </form>
  );
};
