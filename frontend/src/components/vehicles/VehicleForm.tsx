import { FormEvent, useState } from 'react';
import { CreateVehicleInput, Vehicle } from '../../types';
import { Button } from '../ui/Button';

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
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [quantity, setQuantity] = useState(
    initialData?.quantity?.toString() || '0'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({
        make,
        model,
        category,
        price: Number(price),
        quantity: Number(quantity),
      });
      if (!initialData) {
        setMake('');
        setModel('');
        setCategory('');
        setPrice('');
        setQuantity('0');
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

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <input
            id="make"
            value={make}
            onChange={(e) => setMake(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            required
          />
        </div>
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

      <div className="form-actions">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};
