
import { useState, useEffect } from 'react';
import { useVehicle, Vehicle } from '@/context/VehicleContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Car, ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const VehicleSelector = () => {
  const { vehicles, setCurrentVehicle, updateTripData } = useVehicle();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.economicNumber.toLowerCase().includes(search.toLowerCase()) ||
    vehicle.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    updateTripData({
      vehicle,
      initialKilometers: vehicle.lastKilometers,
      initialFuelLevel: vehicle.lastFuelLevel,
      lastMaintenanceDate: vehicle.lastMaintenanceDate,
      active: true
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Buscar vehículo..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>Seleccionar vehículo</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full" align="start" style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <DropdownMenuItem
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle)}
                  className="flex justify-between"
                >
                  <span className="font-medium">{vehicle.plate} - {vehicle.model} ({vehicle.year})</span>
                  <span className="text-muted-foreground text-sm">{vehicle.economicNumber}</span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="flex flex-col items-center text-muted-foreground p-4">
                <Car className="h-12 w-12 mb-2" />
                <p>No se encontraron vehículos</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default VehicleSelector;
