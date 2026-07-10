import { Vehicle } from '../../types';
import { VehicleCard } from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  onPurchase: (id: string) => void;
  purchasingId?: string | null;
  loading?: boolean;
}

export const VehicleList = ({
  vehicles,
  onPurchase,
  purchasingId = null,
  loading = false,
}: VehicleListProps) => {
  if (loading) {
    return <div className="loading">Loading vehicles...</div>;
  }

  if (vehicles.length === 0) {
    return (
      <div className="empty-state">
        <p>No vehicles found.</p>
      </div>
    );
  }

  return (
    <div className="vehicle-grid">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle._id}
          vehicle={vehicle}
          onPurchase={onPurchase}
          purchasing={purchasingId === vehicle._id}
        />
      ))}
    </div>
  );
};
