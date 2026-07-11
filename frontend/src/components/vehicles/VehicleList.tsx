import { Vehicle } from '../../types';
import { VehicleCard } from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  onPurchase: (id: string) => void;
  onViewDetails?: (vehicle: Vehicle) => void;
  purchasingId?: string | null;
  loading?: boolean;
}

export const VehicleList = ({
  vehicles,
  onPurchase,
  onViewDetails,
  purchasingId = null,
  loading = false,
}: VehicleListProps) => {
  if (loading) {
    return <div className="loading">Loading available vehicles...</div>;
  }

  if (vehicles.length === 0) {
    return (
      <div className="empty-state">
        <p>No vehicles match your search filters.</p>
        <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Try resetting the filters or modifying your query.</span>
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
          onViewDetails={onViewDetails}
          purchasing={purchasingId === vehicle._id}
        />
      ))}
    </div>
  );
};
