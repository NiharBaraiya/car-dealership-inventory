import { Vehicle } from '../../types';
import { formatPrice, getVehicleStats } from '../../utils/vehicle';

interface VehicleStatsProps {
  vehicles: Vehicle[];
}

export const VehicleStats = ({ vehicles }: VehicleStatsProps) => {
  const stats = getVehicleStats(vehicles);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-icon">🚗</span>
        <div className="stat-content">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Total Models</span>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">✅</span>
        <div className="stat-content">
          <span className="stat-value">{stats.inStock}</span>
          <span className="stat-label">In Stock</span>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">📦</span>
        <div className="stat-content">
          <span className="stat-value">{stats.totalUnits}</span>
          <span className="stat-label">Units Available</span>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">💰</span>
        <div className="stat-content">
          <span className="stat-value">{formatPrice(stats.totalValue)}</span>
          <span className="stat-label">Inventory Value</span>
        </div>
      </div>
    </div>
  );
};
