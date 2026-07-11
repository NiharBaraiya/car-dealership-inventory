import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehiclesApi } from '../api/vehicles.api';
import { Vehicle } from '../types';
import { VehicleForm } from '../components/vehicles/VehicleForm';
import { VehicleStats } from '../components/vehicles/VehicleStats';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { getVehicleImageUrl } from '../utils/vehicle';

export const AdminPage = () => {
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
    setIsFormOpen(false);
    await fetchVehicles();
  };

  const handleUpdate = async (data: Parameters<typeof vehiclesApi.create>[0]) => {
    if (!editingVehicle) return;
    await vehiclesApi.update(editingVehicle._id, data);
    setEditingVehicle(null);
    setIsFormOpen(false);
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
    return <div className="loading">Checking credentials...</div>;
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
        <div>
          <h1>Admin Dashboard</h1>
          <p>Real-time analytics and inventory control panel</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingVehicle(null);
            setIsFormOpen(true);
          }}
          aria-label="Add a new vehicle"
        >
          + Add New Vehicle
        </Button>
      </header>

      {/* Render Statistics Cards */}
      {!loading && <VehicleStats vehicles={vehicles} />}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVehicle(null);
        }}
        title={editingVehicle ? 'Edit Vehicle Profile' : 'Register New Vehicle'}
        size="lg"
      >
        <VehicleForm
          key={editingVehicle?._id || 'new'}
          initialData={editingVehicle || undefined}
          onSubmit={editingVehicle ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingVehicle(null);
          }}
          submitLabel={editingVehicle ? 'Save Changes' : 'Add Vehicle'}
        />
      </Modal>

      <section className="admin-section">
        <h2>Vehicle Stock Registry</h2>
        {loading ? (
          <div className="loading">Updating registry data...</div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-img-cell">Vehicle</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Control Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => {
                  const isOutOfStock = vehicle.quantity <= 0;
                  const isLowStock = vehicle.quantity > 0 && vehicle.quantity <= 3;
                  
                  return (
                    <tr key={vehicle._id}>
                      <td className="admin-table-img-cell">
                        <img
                          src={getVehicleImageUrl(vehicle.imageUrl)}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="admin-table-thumb"
                        />
                      </td>
                      <td style={{ fontWeight: 600 }}>{vehicle.make}</td>
                      <td>{vehicle.model}</td>
                      <td>
                        <span className="vehicle-category" style={{ marginTop: 0 }}>{vehicle.category}</span>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
                        ${vehicle.price.toLocaleString()}
                      </td>
                      <td>
                        {isOutOfStock ? (
                          <Badge variant="danger">Sold Out (0)</Badge>
                        ) : isLowStock ? (
                          <Badge variant="warning">Low Stock ({vehicle.quantity})</Badge>
                        ) : (
                          <Badge variant="success">In Stock ({vehicle.quantity})</Badge>
                        )}
                      </td>
                      <td className="admin-actions">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setIsFormOpen(true);
                          }}
                          aria-label={`Edit ${vehicle.make} ${vehicle.model}`}
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
                              aria-label="Restock quantity"
                            />
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleRestock(vehicle._id)}
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRestockId(null)}
                            >
                              ✕
                            </Button>
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRestockId(vehicle._id)}
                            aria-label={`Restock ${vehicle.make} ${vehicle.model}`}
                          >
                            Restock
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(vehicle._id)}
                          aria-label={`Delete ${vehicle.make} ${vehicle.model}`}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
