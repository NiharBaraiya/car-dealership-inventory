import { Vehicle } from '../../types';
import { Button } from '../ui/Button';
import { formatPrice, getVehicleImageUrl } from '../../utils/vehicle';
import { Badge } from '../ui/Badge';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => void;
  onViewDetails?: (vehicle: Vehicle) => void;
  purchasing?: boolean;
}

export const VehicleCard = ({
  vehicle,
  onPurchase,
  onViewDetails,
  purchasing = false,
}: VehicleCardProps) => {
  const isOutOfStock = vehicle.quantity <= 0;
  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;

  return (
    <div className={`vehicle-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="vehicle-card-image">
        <img
          src={getVehicleImageUrl(vehicle.imageUrl)}
          alt={`${vehicle.make} ${vehicle.model}`}
        />
        <div className="vehicle-card-badge-container">
          <Badge variant="accent">{vehicle.category}</Badge>
          {isOutOfStock ? (
            <Badge variant="danger">Sold Out</Badge>
          ) : isLowStock ? (
            <Badge variant="warning">Low Stock</Badge>
          ) : (
            <Badge variant="success">Available</Badge>
          )}
        </div>
      </div>
      
      <div className="vehicle-card-header">
        <h3>
          {vehicle.make} <span style={{ fontWeight: 400 }}>{vehicle.model}</span>
          <span className="vehicle-year">({vehicle.year})</span>
        </h3>
      </div>

      <div className="vehicle-card-body">
        <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
        
        <p className={`vehicle-quantity ${isOutOfStock ? 'zero' : ''}`}>
          {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} units available`}
        </p>

        {vehicle.description && (
          <p className="vehicle-description">
            {vehicle.description}
          </p>
        )}
      </div>

      <div className="vehicle-card-footer">
        {onViewDetails && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(vehicle)}
            aria-label={`View details of ${vehicle.make} ${vehicle.model}`}
          >
            Details
          </Button>
        )}
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onPurchase(vehicle._id)}
          disabled={isOutOfStock || purchasing}
          aria-label={`Purchase ${vehicle.make} ${vehicle.model}`}
        >
          {purchasing ? 'Buying...' : 'Purchase'}
        </Button>
      </div>
    </div>
  );
};
