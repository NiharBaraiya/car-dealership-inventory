import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesApi } from '../api/vehicles.api';
import { Vehicle } from '../types';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { Button } from '../components/ui/Button';

export const AdminPage = () => {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState('10');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.getAll();
      setVehicles(data);
    } catch {
      alert('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchVehicles();
    }
  }, [isAuthenticated, isAdmin]);

  const handleCreate = async (data: Parameters<typeof vehiclesApi.create>[0]) => {
    await vehiclesApi.create(data);
    await fetchVehicles();
  };

  const handleUpdate = async (data: Parameters<typeof vehiclesApi.create>[0]) => {
    if (!editingVehicle) return;
    await vehiclesApi.update(editingVehicle._id, data);
    setEditingVehicle(null);
    await fetchVehicles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    await vehiclesApi.delete(id);
    await fetchVehicles();
  };

  const handleRestock = async (id: string) => {
    const amount = Number(restockAmount);
    if (amount < 1) return;
    await vehiclesApi.restock(id, amount);
    setRestockId(null);
    await fetchVehicles();
  };

  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page admin-page">
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage vehicle inventory</p>
      </header>

      <section className="admin-section">
        <h2>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
        <VehicleForm
          key={editingVehicle?._id || 'new'}
          initialData={editingVehicle || undefined}
          onSubmit={editingVehicle ? handleUpdate : handleCreate}
          onCancel={editingVehicle ? () => setEditingVehicle(null) : undefined}
          submitLabel={editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
        />
      </section>

      <section className="admin-section">
        <h2>All Vehicles</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle._id}>
                  <td>{vehicle.make}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.category}</td>
                  <td>${vehicle.price.toLocaleString()}</td>
                  <td>{vehicle.quantity}</td>
                  <td className="admin-actions">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setEditingVehicle(vehicle)}
                    >
                      Edit
                    </Button>
                    {restockId === vehicle._id ? (
                      <span className="restock-inline">
                        <input
                          type="number"
                          value={restockAmount}
                          onChange={(e) => setRestockAmount(e.target.value)}
                          min="1"
                          className="restock-input"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleRestock(vehicle._id)}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRestockId(null)}
                        >
                          Cancel
                        </Button>
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRestockId(vehicle._id)}
                      >
                        Restock
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(vehicle._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};
