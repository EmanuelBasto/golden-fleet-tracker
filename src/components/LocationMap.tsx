
import { useState, useEffect } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface LocationMapProps {
  onLocationSelect: (data: { latitude: number; longitude: number; photo?: string }) => void;
  buttonText?: string;
  readOnly?: boolean;
  initialLocation?: { latitude: number; longitude: number } | null;
}

const LocationMap = ({ 
  onLocationSelect, 
  buttonText = "Obtener Ubicación", 
  readOnly = false,
  initialLocation = null
}: LocationMapProps) => {
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(initialLocation);
  const [locationImage, setLocationImage] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setLocation(newLocation);
          
          // Generate a mock map image for demonstration
          const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${newLocation.latitude},${newLocation.longitude}&zoom=14&size=400x200&markers=color:red%7C${newLocation.latitude},${newLocation.longitude}&key=DEMO_KEY`;
          setLocationImage(mapImageUrl);
          
          onLocationSelect({
            ...newLocation,
            photo: mapImageUrl
          });
          
          toast({
            title: "Ubicación obtenida",
            description: `Lat: ${newLocation.latitude.toFixed(6)}, Long: ${newLocation.longitude.toFixed(6)}`,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            variant: "destructive",
            title: "Error al obtener ubicación",
            description: error.message,
          });
        }
      );
    } else {
      toast({
        variant: "destructive",
        title: "Geolocalización no disponible",
        description: "Tu navegador no soporta geolocalización",
      });
    }
  };

  // For demo purposes, set a default location if none provided
  useEffect(() => {
    if (!location && initialLocation) {
      setLocation(initialLocation);
      const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${initialLocation.latitude},${initialLocation.longitude}&zoom=14&size=400x200&markers=color:red%7C${initialLocation.latitude},${initialLocation.longitude}&key=DEMO_KEY`;
      setLocationImage(mapImageUrl);
    } else if (!location && !initialLocation && readOnly) {
      // Set a default location for demo purposes
      const defaultLocation = { latitude: 19.4326, longitude: -99.1332 }; // Mexico City
      setLocation(defaultLocation);
      const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${defaultLocation.latitude},${defaultLocation.longitude}&zoom=14&size=400x200&markers=color:red%7C${defaultLocation.latitude},${defaultLocation.longitude}&key=DEMO_KEY`;
      setLocationImage(mapImageUrl);
    }
  }, [initialLocation, location, readOnly]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden bg-card">
        {locationImage ? (
          <div className="relative">
            <img 
              src={locationImage} 
              alt="Mapa de ubicación" 
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-2 right-2 bg-background/80 rounded-full p-1">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 bg-muted">
            <Camera className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>

      {location && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Latitud</p>
            <p className="p-2 bg-muted rounded-md text-sm">
              {location.latitude.toFixed(6)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Longitud</p>
            <p className="p-2 bg-muted rounded-md text-sm">
              {location.longitude.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {!readOnly && (
        <Button 
          onClick={handleGetLocation} 
          className="w-full"
          variant="default"
        >
          <MapPin className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default LocationMap;
