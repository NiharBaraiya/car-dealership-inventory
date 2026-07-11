import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesApi } from '../api/vehicles.api';
import { Vehicle, VehicleSearchParams, SortOption } from '../types';
import { VehicleSearch } from '../components/vehicles/VehicleSearch';
import { VehicleList } from '../components/vehicles/VehicleList';
import { VehicleDetailModal } from '../components/vehicles/VehicleDetailModal';
import { sortVehicles } from '../utils/vehicle';
import { Button } from '../components/ui/Button';

export const HomePage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [error, setError] = useState('');

  const fetchVehicles = async (params?: VehicleSearchParams) => {
    setLoading(true);
    setError('');
    try {
      const data = params
        ? await vehiclesApi.search(params)
        : await vehiclesApi.getAll();
      setVehicles(data);
    } catch {
      setError('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchVehicles();
    }
  }, [isAuthenticated]);

  const handlePurchase = async (id: string) => {
    setPurchasingId(id);
    try {
      const updated = await vehiclesApi.purchase(id);
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? updated : v))
      );
      // Synchronize modal state if open
      if (selectedVehicle && selectedVehicle._id === id) {
        setSelectedVehicle(updated);
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Purchase failed';
      alert(message);
    } finally {
      setPurchasingId(null);
    }
  };

  if (authLoading) {
    return <div className="loading">Initializing inventory system...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page home-page">
      {/* Hero Welcome Banner */}
      <div className="hero-banner">
        <h2 className="hero-title">Discover the Future of Driving</h2>
        <p className="hero-subtitle">
          Explore our collection of modern electric vehicles, robust sport utility vehicles, racing sports series, and luxury roadsters. Instant purchase and registry management included.
        </p>
      </div>

      <VehicleSearch
        onSearch={fetchVehicles}
        onClear={() => {
          setSortOption('newest');
          fetchVehicles();
        }}
        sort={sortOption}
        onSortChange={setSortOption}
      />

      {error && <div className="error-message">{error}</div>}

      <VehicleList
        vehicles={sortVehicles(vehicles, sortOption)}
        onPurchase={handlePurchase}
        onViewDetails={(v) => setSelectedVehicle(v)}
        purchasingId={purchasingId}
        loading={loading}
      />

      {/* Product Detail Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={selectedVehicle !== null}
        onClose={() => setSelectedVehicle(null)}
        onPurchase={handlePurchase}
        purchasing={purchasingId === selectedVehicle?._id}
      />

      {/* Why Choose Velocity Motors Section */}
      <section className="features-section">
        <h2 className="features-title">The Velocity Motors Difference</h2>
        <p className="features-subtitle">We design our services to match the premium quality of our vehicles.</p>
        <div className="features-grid">
          <div className="feature-item-card">
            <span className="feature-item-icon">🛡️</span>
            <h3>Certified Premium Protection</h3>
            <p>Every vehicle undergoes a rigorous 150-point inspection and comes with a complimentary 10-year/100,000-mile limited warranty.</p>
          </div>
          <div className="feature-item-card">
            <span className="feature-item-icon">⚡</span>
            <h3>Electric Vehicle Evolution</h3>
            <p>Purchase any EV category car and receive complimentary level 2 home charger hardware plus professional home installation.</p>
          </div>
          <div className="feature-item-card">
            <span className="feature-item-icon">🤝</span>
            <h3>Seamless Premium Financing</h3>
            <p>Connect with top tier auto lenders directly inside our platform for instant approvals and custom competitive rates.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup widget */}
      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-content">
            <h2>Join the Velocity Circle</h2>
            <p>Subscribe to receive early releases, private dealer collections, and premium automotive news events.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to Velocity Circle!'); }}>
            <input type="email" placeholder="Enter your email address" required aria-label="Email address for subscription" />
            <Button type="submit" variant="primary">Subscribe</Button>
          </form>
        </div>
      </section>
    </div>
  );
};
