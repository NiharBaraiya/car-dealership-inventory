import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesApi } from '../api/vehicles.api';
import { Vehicle, VehicleSearchParams } from '../types';
import { VehicleSearch } from '../components/vehicles/VehicleSearch';
import { VehicleList } from '../components/vehicles/VehicleList';

export const HomePage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
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
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page home-page">
      <header className="page-header">
        <h1>Vehicle Inventory</h1>
        <p>Browse and purchase from our available stock</p>
      </header>

      <VehicleSearch
        onSearch={fetchVehicles}
        onClear={() => fetchVehicles()}
      />

      {error && <div className="error-message">{error}</div>}

      <VehicleList
        vehicles={vehicles}
        onPurchase={handlePurchase}
        purchasingId={purchasingId}
        loading={loading}
      />
    </div>
  );
};
