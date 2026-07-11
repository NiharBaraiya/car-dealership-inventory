import { Vehicle } from '../../types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { formatPrice, getVehicleImageUrl } from '../../utils/vehicle';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (id: string) => void;
  purchasing?: boolean;
}

export const VehicleDetailModal = ({
  vehicle,
  isOpen,
  onClose,
  onPurchase,
  purchasing = false,
}: VehicleDetailModalProps) => {
  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} size="lg">
      <div className="vehicle-detail-grid">
        <div className="vehicle-detail-image-wrapper">
          <img
            src={getVehicleImageUrl(vehicle.imageUrl)}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="vehicle-detail-image"
          />
          <div className="vehicle-detail-badges">
            <span className="vehicle-detail-badge category">{vehicle.category}</span>
            <span className={`vehicle-detail-badge stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
              {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Units Available`}
            </span>
          </div>
        </div>

        <div className="vehicle-detail-info">
          <div className="vehicle-detail-header-block">
            <div className="vehicle-detail-title-row">
              <h2>
                {vehicle.make} <span className="text-light">{vehicle.model}</span>
              </h2>
              <span className="vehicle-detail-year">{vehicle.year}</span>
            </div>
            <p className="vehicle-detail-price">{formatPrice(vehicle.price)}</p>
          </div>

          <div className="vehicle-detail-specs">
            <div className="spec-item">
              <span className="spec-icon">🏷️</span>
              <div className="spec-text">
                <span className="spec-label">Make</span>
                <span className="spec-val">{vehicle.make}</span>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🏎️</span>
              <div className="spec-text">
                <span className="spec-label">Model</span>
                <span className="spec-val">{vehicle.model}</span>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📁</span>
              <div className="spec-text">
                <span className="spec-label">Category</span>
                <span className="spec-val">{vehicle.category}</span>
              </div>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📅</span>
              <div className="spec-text">
                <span className="spec-label">Year</span>
                <span className="spec-val">{vehicle.year}</span>
              </div>
            </div>
          </div>

          <div className="vehicle-detail-description-section">
            <h3>Vehicle Overview</h3>
            <p className="vehicle-detail-description">
              {vehicle.description ||
                `This premium ${vehicle.year} ${vehicle.make} ${vehicle.model} is built with industry-leading technology, advanced safety specifications, and unmatched driving comfort. Perfect for daily commutes or long journeys. Contact us today for personalized financing offers and custom configurations.`}
            </p>
          </div>

          <div className="vehicle-detail-actions">
            <Button
              onClick={() => onPurchase(vehicle._id)}
              disabled={isOutOfStock || purchasing}
              size="lg"
              className="vehicle-detail-purchase-btn"
            >
              {purchasing ? (
                <>
                  <span className="spinner-dots">Processing Purchase</span>
                </>
              ) : isOutOfStock ? (
                'Out of Stock'
              ) : (
                'Purchase Vehicle'
              )}
            </Button>
            <Button variant="outline" size="lg" onClick={onClose}>
              Close Overview
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
