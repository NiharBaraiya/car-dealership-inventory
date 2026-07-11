import { FormEvent, useState } from 'react';
import { VehicleSearchParams, SortOption } from '../../types';
import { Button } from '../ui/Button';
import { VEHICLE_CATEGORIES } from '../../utils/vehicle';

interface VehicleSearchProps {
  onSearch: (params: VehicleSearchParams) => void;
  onClear: () => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const VehicleSearch = ({ onSearch, onClear, sort, onSortChange }: VehicleSearchProps) => {
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
          placeholder="Filter by Make (e.g. Tesla)"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          aria-label="Make"
        />
        <input
          type="text"
          placeholder="Filter by Model (e.g. Model Y)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          aria-label="Model"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category"
        >
          <option value="">All Categories</option>
          {VEHICLE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min="0"
          aria-label="Min Price"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min="0"
          aria-label="Max Price"
        />
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          aria-label="Sort By"
          className="sort-select"
        >
          <option value="newest">Sort By: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>
      <div className="search-actions">
        <Button type="submit" variant="primary">Search Inventory</Button>
        <Button type="button" variant="secondary" onClick={handleClear}>
          Reset Filters
        </Button>
      </div>
    </form>
  );
};
