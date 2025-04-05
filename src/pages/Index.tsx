
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center w-full max-w-md">
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-5/6 mx-auto" />
          <Skeleton className="h-8 w-2/3 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Index;
