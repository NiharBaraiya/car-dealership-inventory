import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="page auth-page">
      <RegisterForm />
    </div>
  );
};
