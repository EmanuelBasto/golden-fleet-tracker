
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import AppLayout from '@/components/AppLayout';
import LocationMap from '@/components/LocationMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const EndUsage = () => {
  const { currentVehicle, tripData, finishTrip } = useVehicle();
  const [currentFuel, setCurrentFuel] = useState(tripData.initialFuelLevel.toString());
  const [currentKilometers, setCurrentKilometers] = useState(tripData.initialKilometers.toString());
  const [location, setLocation] = useState<{latitude: number; longitude: number; photo?: string} | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLocationSelect = (data: {latitude: number; longitude: number; photo?: string}) => {
    setLocation(data);
  };

  const handleFuelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers between 0 and 100
    if (/^\d*$/.test(value) && (parseInt(value) <= 100 || value === '')) {
      setCurrentFuel(value);
    }
  };

  const handleKilometersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers greater than or equal to initial kilometers
    if (/^\d*$/.test(value) && (parseInt(value) >= tripData.initialKilometers || value === '')) {
      setCurrentKilometers(value);
    }
  };

  const handleFinalize = () => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor obtén la ubicación actual"
      });
      return;
    }
    
    if (!currentFuel || parseInt(currentFuel) < 0 || parseInt(currentFuel) > 100) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa un nivel de combustible válido (0-100%)"
      });
      return;
    }
    
    if (!currentKilometers || parseInt(currentKilometers) < tripData.initialKilometers) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `El kilometraje debe ser mayor o igual a ${tripData.initialKilometers}`
      });
      return;
    }
    
    finishTrip(
      location, 
      parseInt(currentKilometers), 
      parseInt(currentFuel)
    );
    
    toast({
      title: "¡Uso finalizado!",
      description: "El registro de uso del vehículo ha finalizado correctamente",
    });
    
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/in-use');
  };

  return (
    <AppLayout title="Finalizar Uso">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finalizar Uso</h2>
          <p className="text-muted-foreground">
            Registra la información final del uso del vehículo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ubicación Final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationMap 
                onLocationSelect={handleLocationSelect}
                buttonText="Obtener Ubicación"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Final</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentKilometers">Kilometraje Actual</Label>
                <Input
                  id="currentKilometers"
                  placeholder="Kilometraje actual"
                  value={currentKilometers}
                  onChange={handleKilometersChange}
                  type="number"
                  min={tripData.initialKilometers}
                />
                <p className="text-xs text-muted-foreground">
                  Debe ser mayor o igual a {tripData.initialKilometers}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentFuel">Combustible Actual (%)</Label>
                <Input
                  id="currentFuel"
                  placeholder="0-100"
                  value={currentFuel}
                  onChange={handleFuelChange}
                  type="number"
                  min={0}
                  max={100}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Información del Viaje</Label>
                <div className="p-3 rounded-md bg-muted">
                  <p className="text-sm">
                    <span className="font-medium">Proyecto:</span> {tripData.projectName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Fecha de inicio:</span> {tripData.startDate}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Kilometraje inicial:</span> {tripData.initialKilometers}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Combustible inicial:</span> {tripData.initialFuelLevel}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button 
            onClick={handleCancel} 
            variant="outline"
            size="lg"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          
          <Button 
            onClick={handleFinalize} 
            disabled={!location || !currentFuel || !currentKilometers}
            size="lg"
          >
            Finalizar
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default EndUsage;
