
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
import { ArrowRight, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const RefuelPage = () => {
  const { currentVehicle, tripData, addRefuel } = useVehicle();
  const [locationDetail, setLocationDetail] = useState('');
  const [currentFuel, setCurrentFuel] = useState(tripData.initialFuelLevel.toString());
  const [amount, setAmount] = useState('');
  const [fuelPhoto, setFuelPhoto] = useState<string | undefined>(undefined);
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

  const handleFuelPhotoSelect = (imageBase64: string) => {
    setFuelPhoto(imageBase64);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleFuelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers between 0 and 100
    if (/^\d*$/.test(value) && (parseInt(value) <= 100 || value === '')) {
      setCurrentFuel(value);
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
    
    if (!fuelPhoto) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor sube una foto del combustible"
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
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor ingresa un monto válido"
      });
      return;
    }
    
    addRefuel({
      location: {
        ...location,
        description: locationDetail
      },
      fuelLevel: parseInt(currentFuel),
      amount: parseFloat(amount),
      photo: fuelPhoto,
      date: new Date().toISOString()
    });
    
    toast({
      title: "¡Recarga registrada!",
      description: "La recarga de combustible se ha registrado correctamente",
    });
    
    navigate('/in-use');
  };

  const handleCancel = () => {
    navigate('/in-use');
  };

  return (
    <AppLayout title="Cargar Combustible">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cargar Combustible</h2>
          <p className="text-muted-foreground">
            Registra una carga de combustible durante el uso del vehículo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LocationMap 
                onLocationSelect={handleLocationSelect}
                buttonText="Obtener Ubicación"
              />
              
              <div className="space-y-2">
                <Label htmlFor="locationDetail">Detalles de la Ubicación</Label>
                <Input
                  id="locationDetail"
                  placeholder="Ejemplo: Gasolinera XYZ"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información de Combustible</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Foto Evidencia Combustible Actual</Label>
                <ImageUpload 
                  onImageSelect={handleFuelPhotoSelect}
                  label="Subir Foto de Combustible"
                  initialImage={fuelPhoto}
                />
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
                <Label htmlFor="amount">Monto</Label>
                <Input
                  id="amount"
                  placeholder="Monto de la carga"
                  value={amount}
                  onChange={handleAmountChange}
                  type="text"
                  inputMode="decimal"
                />
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
            disabled={!location || !fuelPhoto || !currentFuel || !amount}
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

export default RefuelPage;
