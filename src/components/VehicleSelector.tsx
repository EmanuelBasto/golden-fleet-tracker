
import { useState } from 'react';
import { useVehicle, Vehicle } from '@/context/VehicleContext';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Car } from 'lucide-react';

const VehicleSelector = () => {
  const { vehicles, setCurrentVehicle, updateTripData } = useVehicle();
  const [search, setSearch] = useState('');

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead className="hidden md:table-cell">Modelo</TableHead>
              <TableHead className="hidden md:table-cell">No. Económico</TableHead>
              <TableHead className="hidden lg:table-cell">Ubicación</TableHead>
              <TableHead className="hidden lg:table-cell">Color</TableHead>
              <TableHead className="hidden lg:table-cell">No. Flota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <TableRow 
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell className="hidden md:table-cell">{vehicle.model} ({vehicle.year})</TableCell>
                  <TableCell className="hidden md:table-cell">{vehicle.economicNumber}</TableCell>
                  <TableCell className="hidden lg:table-cell">{vehicle.location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{vehicle.color}</TableCell>
                  <TableCell className="hidden lg:table-cell">{vehicle.fleetNumber}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Car className="h-12 w-12 mb-2" />
                    <p>No se encontraron vehículos</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default VehicleSelector;
