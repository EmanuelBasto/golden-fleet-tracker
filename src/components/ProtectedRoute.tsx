
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if this is an admin route and the user is not an admin
  if (location.pathname.includes('admin') && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
