
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      if (user.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      // Redirect to login page
      navigate('/');
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Redirigiendo...</h1>
      </div>
    </div>
  );
};

export default Index;
