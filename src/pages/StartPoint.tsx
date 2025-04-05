
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVehicle } from '@/context/VehicleContext';
import AppLayout from '@/components/AppLayout';
import LocationMap from '@/components/LocationMap';
import ImageUpload from '@/components/ImageUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const StartPoint = () => {
  const { currentVehicle, tripData, updateTripData } = useVehicle();
  const [locationDetail, setLocationDetail] = useState('');
  const [kilometersPhoto, setKilometersPhoto] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<{latitude: number; longitude: number; photo?: string} | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if no vehicle is selected
  useEffect(() => {
    if (!currentVehicle) {
      navigate('/vehicle-registration');
    }
    
    // If already has destination, redirect to in-use
    if (tripData.destination) {
      navigate('/in-use');
    }
    
    // If already has start location, populate fields
    if (tripData.startLocation) {
      setLocation(tripData.startLocation);
      setLocationDetail(tripData.startLocation.description || '');
    }
    
    if (tripData.initialKilometerPhoto) {
      setKilometersPhoto(tripData.initialKilometerPhoto);
    }
  }, [currentVehicle, tripData, navigate]);

  const handleLocationSelect = (data: {latitude: number; longitude: number; photo?: string}) => {
    setLocation(data);
  };

  const handleKilometerPhotoSelect = (imageBase64: string) => {
    setKilometersPhoto(imageBase64);
  };

  const handleContinue = () => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor obtén la ubicación actual"
      });
      return;
    }
    
    if (!kilometersPhoto) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor sube una foto del kilometraje"
      });
      return;
    }
    
    updateTripData({
      startLocation: {
        ...location,
        description: locationDetail
      },
      initialKilometerPhoto: kilometersPhoto
    });
    
    navigate('/destination');
  };

  return (
    <AppLayout title="Punto de Inicio">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Punto de Inicio</h2>
          <p className="text-muted-foreground">
            Registra la ubicación inicial del vehículo y el kilometraje.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ubicación de Inicio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationMap 
                onLocationSelect={handleLocationSelect}
                buttonText="Obtener Ubicación"
                initialLocation={tripData.startLocation || null}
              />
              
              <div className="space-y-2">
                <Label htmlFor="locationDetail">Detalles de la Ubicación</Label>
                <Input
                  id="locationDetail"
                  placeholder="Ejemplo: Estacionamiento principal"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información del Vehículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Kilometraje Inicial</Label>
                <Input 
                  value={tripData.initialKilometers?.toLocaleString() + " km"} 
                  disabled 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Foto del Kilometraje</Label>
                <ImageUpload 
                  onImageSelect={handleKilometerPhotoSelect}
                  label="Subir Foto del Kilometraje"
                  initialImage={tripData.initialKilometerPhoto}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Combustible Actual</Label>
                <Input 
                  value={tripData.initialFuelLevel + "%"} 
                  disabled 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Último Mantenimiento</Label>
                <Input 
                  value={tripData.lastMaintenanceDate} 
                  disabled 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleContinue} 
            disabled={!location || !kilometersPhoto}
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

export default StartPoint;
