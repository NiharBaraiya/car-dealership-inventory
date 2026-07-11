import { FormEvent, useState } from 'react';
import { CreateVehicleInput, Vehicle } from '../../types';
import { Button } from '../ui/Button';
import { ImageUpload } from './ImageUpload';
import { VEHICLE_CATEGORIES } from '../../utils/vehicle';

interface VehicleFormProps {
  initialData?: Vehicle;
  onSubmit: (data: CreateVehicleInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export const VehicleForm = ({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Add Vehicle',
}: VehicleFormProps) => {
  const [make, setMake] = useState(initialData?.make || '');
  const [model, setModel] = useState(initialData?.model || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [year, setYear] = useState(
    initialData?.year?.toString() || new Date().getFullYear().toString()
  );
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [quantity, setQuantity] = useState(
    initialData?.quantity?.toString() || '0'
  );
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle case where seeded or existing vehicle has a category not in predefined list
  const categoriesList = VEHICLE_CATEGORIES.includes(initialData?.category as any)
    ? VEHICLE_CATEGORIES
    : initialData?.category
      ? [...VEHICLE_CATEGORIES, initialData.category]
      : VEHICLE_CATEGORIES;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        make,
        model,
        category,
        year: Number(year),
        price: Number(price),
        quantity: Number(quantity),
        description: description || undefined,
        imageUrl: imageUrl || undefined,
      });
      if (!initialData) {
        setMake('');
        setModel('');
        setCategory('');
        setYear(new Date().getFullYear().toString());
        setPrice('');
        setQuantity('0');
        setImageUrl('');
        setDescription('');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Operation failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-group-image">
        <ImageUpload value={imageUrl} onChange={setImageUrl} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <input
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="e.g. Tesla, Ford, Porsche"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Model S, Mustang, 911 GT3"
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a Category</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max={new Date().getFullYear() + 2}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price ($)</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            placeholder="e.g. 45000"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter a detailed description of the vehicle (features, options, custom configuration, etc.)."
          rows={4}
          className="form-textarea"
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} variant="primary">
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};
