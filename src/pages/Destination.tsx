
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import AppLayout from '@/components/AppLayout';
import LocationMap from '@/components/LocationMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Destination = () => {
  const { currentVehicle, tripData, updateTripData } = useVehicle();
  const [projectName, setProjectName] = useState(tripData.projectName || '');
  const [location, setLocation] = useState<{latitude: number; longitude: number; photo?: string} | null>(
    tripData.destination || null
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if necessary steps are not completed
  useEffect(() => {
    if (!currentVehicle) {
      navigate('/vehicle-registration');
      return;
    }
    
    if (!tripData.startLocation) {
      navigate('/start-point');
      return;
    }
    
    // If already has destination, populate fields
    if (tripData.destination) {
      setLocation(tripData.destination);
      setProjectName(tripData.projectName || '');
    }
  }, [currentVehicle, tripData, navigate]);

  const handleLocationSelect = (data: {latitude: number; longitude: number; photo?: string}) => {
    setLocation(data);
  };

  const handleFinalize = () => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor selecciona la ubicación de destino"
      });
      return;
    }
    
    if (!projectName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa el nombre del proyecto"
      });
      return;
    }
    
    updateTripData({
      destination: location,
      projectName
    });
    
    navigate('/in-use');
  };

  return (
    <AppLayout title="Destino">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Destino</h2>
          <p className="text-muted-foreground">
            Registra el destino y el proyecto para este viaje.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ubicación de Destino</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <LocationMap 
              onLocationSelect={handleLocationSelect}
              buttonText="Seleccionar en Mapa"
              initialLocation={tripData.destination || null}
            />
            
            <div className="space-y-2">
              <Label htmlFor="projectName">Nombre del Proyecto</Label>
              <Input
                id="projectName"
                placeholder="Ejemplo: Visita Cliente XYZ"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button 
            onClick={handleFinalize} 
            disabled={!location || !projectName}
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

export default Destination;
