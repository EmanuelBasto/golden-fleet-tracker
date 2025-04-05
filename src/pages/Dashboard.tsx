
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Car, ArrowRight, Fuel, Flag } from 'lucide-react';

const Dashboard = () => {
  const { tripData, resetTripData } = useVehicle();
  const navigate = useNavigate();

  const handleStartNewTrip = () => {
    resetTripData();
    navigate('/vehicle-registration');
  };

  const handleContinueTrip = () => {
    if (tripData.destination) {
      navigate('/in-use');
    } else if (tripData.startLocation) {
      navigate('/destination');
    } else if (tripData.vehicle) {
      navigate('/start-point');
    } else {
      navigate('/vehicle-registration');
    }
  };

  return (
    <AppLayout title="Sistema de Registro de Vehículos">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tablero</h2>
          <p className="text-muted-foreground">
            Gestiona el uso de vehículos y registra la información diaria.
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Iniciar Nuevo Registro</CardTitle>
              <CardDescription>
                Registra un nuevo uso de vehículo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="rounded-full bg-primary/10 p-6">
                  <Car className="h-12 w-12 text-primary" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleStartNewTrip}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Registro
              </Button>
            </CardFooter>
          </Card>
          
          {tripData.active && tripData.vehicle && (
            <Card>
              <CardHeader>
                <CardTitle>Continuar Registro Activo</CardTitle>
                <CardDescription>
                  Vehículo: {tripData.vehicle.plate} - {tripData.vehicle.model}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Fuel className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Combustible: {tripData.initialFuelLevel}%</span>
                  </div>
                  <div className="flex items-center">
                    <Flag className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Kilometraje: {tripData.initialKilometers.toLocaleString()} km
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="secondary"
                  onClick={handleContinueTrip}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continuar
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
