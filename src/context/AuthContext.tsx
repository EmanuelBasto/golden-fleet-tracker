
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check for admin credentials
      if (email.toUpperCase() === 'ADMIN@EJEMPLO.COM' && password === 'admin12345') {
        const adminUser = {
          id: 'admin',
          name: 'Administrador',
          email: 'admin@ejemplo.com',
          isAdmin: true
        };
        
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
      }
      // Check for regular user credentials
      else if (email === 'demo@example.com' && password === 'password') {
        const user = {
          id: '1',
          name: 'Demo User',
          email: 'demo@example.com',
          isAdmin: false
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        throw new Error('Credenciales inválidas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would register with a backend
      // This is just a mock implementation
      if (email === 'demo@example.com') {
        throw new Error('Este correo ya está registrado');
      }
      
      const user = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email
      };
      
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('currentVehicle');
    localStorage.removeItem('tripData');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
