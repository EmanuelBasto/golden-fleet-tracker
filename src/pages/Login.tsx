
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa tu correo y contraseña",
      });
      return;
    }
    
    try {
      await login(email, password);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Redirect based on user role
      if (user.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is handled in auth context
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="rounded-full bg-primary h-12 w-12 flex items-center justify-center">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold ml-2">Sistema de Registro de Vehículos</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <span className="mr-2">Cargando...</span>
                  </span>
                ) : (
                  <span className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Iniciar Sesión
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-center text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Para propósitos de demo, usa: demo@example.com / password
        </p>
      </div>
    </div>
  );
};

export default Login;
