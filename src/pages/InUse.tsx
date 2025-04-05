
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, Flag, CheckCircle } from 'lucide-react';

const InUse = () => {
  const { currentVehicle, tripData } = useVehicle();
  const navigate = useNavigate();

  // Redirect if necessary data is missing
  useEffect(() => {
    if (!currentVehicle) {
      navigate('/vehicle-registration');
      return;
    }
    
    if (!tripData.startLocation) {
      navigate('/start-point');
      return;
    }
    
    if (!tripData.destination) {
      navigate('/destination');
      return;
    }
  }, [currentVehicle, tripData, navigate]);

  const handleRefuel = () => {
    navigate('/refuel');
  };

  const handleEndUsage = () => {
    navigate('/end-usage');
  };

  return (
    <AppLayout title="Vehículo en Uso">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vehículo en Uso</h2>
          <p className="text-muted-foreground">
            El vehículo está registrado y en uso activo.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Viaje</CardTitle>
            <CardDescription>
              {currentVehicle?.plate} - {currentVehicle?.model} ({currentVehicle?.year})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Proyecto</p>
                <p className="p-2 bg-muted rounded-md">{tripData.projectName}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Fecha de Inicio</p>
                <p className="p-2 bg-muted rounded-md">{tripData.startDate}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Kilometraje Inicial</p>
                <p className="p-2 bg-muted rounded-md">
                  {tripData.initialKilometers?.toLocaleString()} km
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium">Combustible Actual</p>
                <p className="p-2 bg-muted rounded-md">{tripData.initialFuelLevel}%</p>
              </div>

              {tripData.refuelData && tripData.refuelData.length > 0 && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm font-medium">Recargas de Combustible</p>
                  <div className="p-2 bg-muted rounded-md">
                    <ul className="space-y-2">
                      {tripData.refuelData.map((refuel, index) => (
                        <li key={index} className="text-sm flex justify-between">
                          <span>Fecha: {new Date(refuel.date).toLocaleDateString()}</span>
                          <span>Cantidad: {refuel.amount}</span>
                          <span>Nivel: {refuel.fuelLevel}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cargar Combustible</CardTitle>
              <CardDescription>
                Registra una carga de combustible durante el uso.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="rounded-full bg-primary/10 p-6">
                  <Fuel className="h-12 w-12 text-primary" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleRefuel}
              >
                Cargar Combustible
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Finalizar Uso</CardTitle>
              <CardDescription>
                Finaliza el registro de uso del vehículo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-6">
                <div className="rounded-full bg-primary/10 p-6">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="default"
                className="w-full"
                onClick={handleEndUsage}
              >
                Finalizar Uso
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default InUse;
