
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MapPin, User, LogOut } from 'lucide-react';

const AppHeader = ({ title }: { title: string }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-primary text-primary-foreground py-4 px-4 sm:px-6 shadow-md relative z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">{user.name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout} className="bg-primary-foreground/10">
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
