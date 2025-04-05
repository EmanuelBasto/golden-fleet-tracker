
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import AppLayout from '@/components/AppLayout';
import VehicleSelector from '@/components/VehicleSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const VehicleRegistration = () => {
  const { currentVehicle, tripData } = useVehicle();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/start-point');
  };

  // If there's already a trip in progress, redirect to appropriate page
  useEffect(() => {
    if (tripData.destination) {
      navigate('/in-use');
    } else if (tripData.startLocation) {
      navigate('/destination');
    }
  }, [tripData, navigate]);

  return (
    <AppLayout title="Registro de Vehículo">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Seleccionar Vehículo</h2>
          <p className="text-muted-foreground">
            Selecciona el vehículo que utilizarás en esta jornada.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Vehículos Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <VehicleSelector />
          </CardContent>
        </Card>

        {currentVehicle && (
          <Card>
            <CardHeader>
              <CardTitle>Información del Vehículo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Placa</p>
                  <p className="p-2 bg-muted rounded-md">{currentVehicle.plate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Modelo</p>
                  <p className="p-2 bg-muted rounded-md">
                    {currentVehicle.model} ({currentVehicle.year})
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">No. Económico</p>
                  <p className="p-2 bg-muted rounded-md">{currentVehicle.economicNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Estado</p>
                  <p className="p-2 bg-muted rounded-md">{currentVehicle.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Color</p>
                  <p className="p-2 bg-muted rounded-md">{currentVehicle.color}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">No. de Flota</p>
                  <p className="p-2 bg-muted rounded-md">{currentVehicle.fleetNumber}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Kilometraje Inicial</p>
                  <p className="p-2 bg-muted rounded-md">
                    {currentVehicle.lastKilometers.toLocaleString()} km
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Combustible Actual</p>
                  <p className="p-2 bg-muted rounded-md">{currentVehicle.lastFuelLevel}%</p>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-sm font-medium">Fecha Último Mantenimiento</p>
                  <p className="p-2 bg-muted rounded-md">{currentVehicle.lastMaintenanceDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleContinue} 
            disabled={!currentVehicle}
            size="lg"
          >
            Continuar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default VehicleRegistration;
