import { Vehicle } from '../../types';
import { Button } from '../ui/Button';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => void;
  purchasing?: boolean;
}

export const VehicleCard = ({
  vehicle,
  onPurchase,
  purchasing = false,
}: VehicleCardProps) => {
  const isOutOfStock = vehicle.quantity === 0;

  return (
    <div className={`vehicle-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="vehicle-card-header">
        <h3>
          {vehicle.make} {vehicle.model}
        </h3>
        <span className="vehicle-category">{vehicle.category}</span>
      </div>

      <div className="vehicle-card-body">
        <p className="vehicle-price">${vehicle.price.toLocaleString()}</p>
        <p className={`vehicle-quantity ${isOutOfStock ? 'zero' : ''}`}>
          {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} in stock`}
        </p>
      </div>

      <div className="vehicle-card-footer">
        <Button
          onClick={() => onPurchase(vehicle._id)}
          disabled={isOutOfStock || purchasing}
        >
          {purchasing ? 'Processing...' : 'Purchase'}
        </Button>
      </div>
    </div>
  );
};
