
import AppHeader from './AppHeader';
import { useAuth } from '@/context/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;

  return (
    <div className={`app-layout ${isAdmin ? 'admin-layout' : ''}`}>
      <AppHeader title={title} />
      <main className={`container mx-auto p-4 sm:p-6 ${isAdmin ? 'bg-gray-50' : ''}`}>
        {isAdmin && (
          <div className="mb-4 p-2 bg-[#C78F3D]/10 text-[#C78F3D] rounded-md text-sm font-medium">
            Acceso como Administrador
          </div>
        )}
        {children}
      </main>
      <footer className="bg-muted py-4 text-center text-muted-foreground text-sm">
        <div className="container mx-auto">
          Sistema de Registro de Vehículos &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
