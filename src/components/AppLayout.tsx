
import AppHeader from './AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AppLayout = ({ children, title }: AppLayoutProps) => {
  return (
    <div className="app-layout">
      <AppHeader title={title} />
      <main className="container mx-auto p-4 sm:p-6">
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
