
import { useState, useEffect } from 'react';
import { useVehicle, Vehicle } from '@/context/VehicleContext';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { CheckIcon, BarChart3, LineChart, PieChart, RefreshCcw, TrendingUp, Droplet, Car, Plus, FileText } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const generateMockHistory = (vehicles: Vehicle[]) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  
  return vehicles.map(vehicle => {
    const monthlyData = months.map((month, index) => {
      const baseKm = vehicle.lastKilometers / 12;
      const randomFactor = 0.8 + Math.random() * 0.4;
      const distance = Math.round(baseKm * randomFactor);
      
      const baseFuel = distance / 10;
      const fuelRandomFactor = 0.85 + Math.random() * 0.3;
      const fuel = Math.round(baseFuel * fuelRandomFactor);
      
      return {
        month,
        distance,
        fuel,
        efficiency: Math.round((distance / fuel) * 10) / 10,
        vehicleId: vehicle.id,
        vehicleName: `${vehicle.model} (${vehicle.plate})`,
      };
    });

    return {
      vehicle,
      monthlyData,
      totalDistance: monthlyData.reduce((sum, data) => sum + data.distance, 0),
      totalFuel: monthlyData.reduce((sum, data) => sum + data.fuel, 0),
      averageEfficiency: Math.round((monthlyData.reduce((sum, data) => sum + data.efficiency, 0) / months.length) * 10) / 10,
      bestEfficiency: Math.max(...monthlyData.map(data => data.efficiency)),
    };
  });
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#C78F3D'];

const AdminDashboard = () => {
  const { vehicles, addVehicle } = useVehicle();
  const { toast } = useToast();
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [vehicleHistory, setVehicleHistory] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'distance' | 'fuel' | 'efficiency'>('distance');
  const [viewType, setViewType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    plate: '',
    model: '',
    year: new Date().getFullYear(),
    economicNumber: '',
    location: '',
    color: '',
    fleetNumber: '',
    lastKilometers: 0,
    lastFuelLevel: 0,
    lastMaintenanceDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    const history = generateMockHistory(vehicles);
    setVehicleHistory(history);
  }, [vehicles]);

  const handleVehicleToggle = (vehicleId: string) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleAddVehicle = () => {
    addVehicle({
      ...newVehicle,
      id: Date.now().toString(),
      year: Number(newVehicle.year),
      lastKilometers: Number(newVehicle.lastKilometers),
      lastFuelLevel: Number(newVehicle.lastFuelLevel)
    });
    setIsAddVehicleOpen(false);
    setNewVehicle({
      plate: '',
      model: '',
      year: new Date().getFullYear(),
      economicNumber: '',
      location: '',
      color: '',
      fleetNumber: '',
      lastKilometers: 0,
      lastFuelLevel: 0,
      lastMaintenanceDate: new Date().toISOString().split('T')[0]
    });
    toast({
      title: "Vehículo agregado",
      description: "El vehículo ha sido agregado correctamente.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewVehicle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const exportToExcel = () => {
    const exportData = vehicles.map(vehicle => ({
      'Placa': vehicle.plate,
      'Modelo': vehicle.model,
      'Año': vehicle.year,
      'No. Económico': vehicle.economicNumber,
      'Ubicación': vehicle.location,
      'Color': vehicle.color,
      'No. Flota': vehicle.fleetNumber,
      'Kilometraje (km)': vehicle.lastKilometers,
      'Combustible (L)': vehicle.lastFuelLevel,
      'Último Mantenimiento': vehicle.lastMaintenanceDate
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vehículos');
    XLSX.writeFile(workbook, 'Registro_de_Vehiculos.xlsx');
    
    toast({
      title: "Exportación exitosa",
      description: "Los datos han sido exportados a Excel correctamente.",
    });
  };

  const selectedVehiclesData = vehicleHistory.filter(
    vh => selectedVehicles.includes(vh.vehicle.id)
  );

  // Prepare data for Chart.js
  const getChartData = () => {
    if (selectedVehicles.length === 0) return null;

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    if (viewType === 'bar' || viewType === 'line') {
      // Prepare datasets for bar or line chart
      const datasets = selectedVehiclesData.map((vData, index) => {
        // Get the appropriate data array based on chart type
        const dataValues = vData.monthlyData.map((d: any) => {
          if (chartType === 'distance') return d.distance;
          if (chartType === 'fuel') return d.fuel;
          return d.efficiency;
        });
        
        return {
          label: `${vData.vehicle.model} (${vData.vehicle.plate})`,
          data: dataValues,
          backgroundColor: COLORS[index % COLORS.length],
          borderColor: COLORS[index % COLORS.length],
          borderWidth: viewType === 'line' ? 2 : 1,
          fill: false,
        };
      });
      
      return {
        labels: months,
        datasets
      };
    }
    
    if (viewType === 'pie') {
      // Prepare data for pie chart
      return {
        labels: selectedVehiclesData.map(vData => `${vData.vehicle.model} (${vData.vehicle.plate})`),
        datasets: [
          {
            data: selectedVehiclesData.map(vData => {
              if (chartType === 'distance') return vData.totalDistance;
              if (chartType === 'fuel') return vData.totalFuel;
              return vData.averageEfficiency;
            }),
            backgroundColor: COLORS.slice(0, selectedVehiclesData.length),
            borderWidth: 1,
          },
        ],
      };
    }
    
    return null;
  };

  const chartData = getChartData();

  const getChartTitle = () => {
    const baseTitle = selectedVehicles.length > 1 
      ? 'Comparación de vehículos: ' 
      : 'Datos del vehículo: ';
      
    switch (chartType) {
      case 'distance': return `${baseTitle}Distancia recorrida`;
      case 'fuel': return `${baseTitle}Consumo de combustible`;
      case 'efficiency': return `${baseTitle}Rendimiento (km/l)`;
    }
  };

  const getChartUnit = () => {
    switch (chartType) {
      case 'distance': return 'km';
      case 'fuel': return 'litros';
      case 'efficiency': return 'km/l';
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: getChartTitle(),
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined) {
              label += context.parsed.y + ' ' + getChartUnit();
            } else if (context.parsed !== undefined) {
              label += context.parsed + ' ' + getChartUnit();
            }
            return label;
          }
        }
      }
    },
    scales: viewType !== 'pie' ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: getChartUnit(),
        }
      }
    } : undefined,
  };

  return (
    <AppLayout title="Panel de Administrador">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Administración de Vehículos</h2>
          <div className="flex gap-2">
            <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C78F3D] hover:bg-[#C78F3D]/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Vehículo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
                  <DialogDescription>
                    Complete los datos del nuevo vehículo para agregarlo al sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plate">Placa</Label>
                      <Input id="plate" name="plate" value={newVehicle.plate} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Input id="model" name="model" value={newVehicle.model} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="year">Año</Label>
                      <Input id="year" name="year" type="number" value={newVehicle.year} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="economicNumber">Número Económico</Label>
                      <Input id="economicNumber" name="economicNumber" value={newVehicle.economicNumber} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input id="location" name="location" value={newVehicle.location} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input id="color" name="color" value={newVehicle.color} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fleetNumber">Número de Flota</Label>
                      <Input id="fleetNumber" name="fleetNumber" value={newVehicle.fleetNumber} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastKilometers">Kilometraje Actual (km)</Label>
                      <Input id="lastKilometers" name="lastKilometers" type="number" value={newVehicle.lastKilometers} onChange={handleInputChange} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastFuelLevel">Combustible Actual (L)</Label>
                      <Input id="lastFuelLevel" name="lastFuelLevel" type="number" value={newVehicle.lastFuelLevel} onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastMaintenanceDate">Último Mantenimiento</Label>
                      <Input id="lastMaintenanceDate" name="lastMaintenanceDate" type="date" value={newVehicle.lastMaintenanceDate} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>Cancelar</Button>
                  <Button className="bg-[#C78F3D] hover:bg-[#C78F3D]/90" onClick={handleAddVehicle}>Guardar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={exportToExcel}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#C78F3D]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Vehículos
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#C78F3D]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Recorrido Total
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicleHistory.reduce((sum, vh) => sum + vh.totalDistance, 0).toLocaleString()} km
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#C78F3D]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Combustible Total
              </CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vehicleHistory.reduce((sum, vh) => sum + vh.totalFuel, 0).toLocaleString()} L
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#C78F3D]/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Eficiencia Promedio
              </CardTitle>
              <RefreshCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(vehicleHistory.reduce((sum, vh) => sum + vh.averageEfficiency, 0) / vehicleHistory.length).toFixed(1)} km/L
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Selección de vehículos</CardTitle>
              <CardDescription>
                Selecciona los vehículos para comparar su rendimiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {vehicles.map(vehicle => (
                  <Button
                    key={vehicle.id}
                    variant={selectedVehicles.includes(vehicle.id) ? "default" : "outline"}
                    className={`justify-start ${selectedVehicles.includes(vehicle.id) ? 'bg-[#C78F3D] hover:bg-[#C78F3D]/90' : ''}`}
                    onClick={() => handleVehicleToggle(vehicle.id)}
                  >
                    {selectedVehicles.includes(vehicle.id) && (
                      <CheckIcon className="mr-2 h-4 w-4" />
                    )}
                    {vehicle.model} ({vehicle.plate})
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opciones de visualización</CardTitle>
              <CardDescription>
                Personaliza el tipo de datos y gráficas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de datos</label>
                <Select
                  value={chartType}
                  onValueChange={(value: any) => setChartType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tipo de datos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distance">Distancia recorrida</SelectItem>
                    <SelectItem value="fuel">Consumo de combustible</SelectItem>
                    <SelectItem value="efficiency">Rendimiento (km/l)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de gráfica</label>
                <div className="flex space-x-2">
                  <Button
                    variant={viewType === 'bar' ? "default" : "outline"}
                    className={viewType === 'bar' ? 'bg-[#C78F3D] hover:bg-[#C78F3D]/90' : ''}
                    onClick={() => setViewType('bar')}
                    size="sm"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Barras
                  </Button>
                  <Button
                    variant={viewType === 'line' ? "default" : "outline"}
                    className={viewType === 'line' ? 'bg-[#C78F3D] hover:bg-[#C78F3D]/90' : ''}
                    onClick={() => setViewType('line')}
                    size="sm"
                  >
                    <LineChart className="h-4 w-4 mr-2" />
                    Líneas
                  </Button>
                  <Button
                    variant={viewType === 'pie' ? "default" : "outline"}
                    className={viewType === 'pie' ? 'bg-[#C78F3D] hover:bg-[#C78F3D]/90' : ''}
                    onClick={() => setViewType('pie')}
                    size="sm"
                  >
                    <PieChart className="h-4 w-4 mr-2" />
                    Pastel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedVehicles.length > 0 && chartData && (
          <Card>
            <CardHeader>
              <CardTitle>{getChartTitle()}</CardTitle>
              <CardDescription>
                {viewType === 'bar' || viewType === 'line' 
                  ? 'Datos mensuales comparativos'
                  : 'Distribución total por vehículo'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                {viewType === 'bar' && (
                  <Bar data={chartData} options={chartOptions} />
                )}

                {viewType === 'line' && (
                  <Line data={chartData} options={chartOptions} />
                )}

                {viewType === 'pie' && (
                  <Pie data={chartData} options={chartOptions} />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Estadísticas de Vehículos</CardTitle>
              <CardDescription>
                Resumen detallado del rendimiento de cada vehículo
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Lista completa de estadísticas de vehículos</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead className="text-right">Distancia Total (km)</TableHead>
                  <TableHead className="text-right">Combustible Total (L)</TableHead>
                  <TableHead className="text-right">Eficiencia Promedio (km/L)</TableHead>
                  <TableHead className="text-right">Mejor Eficiencia (km/L)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicleHistory.map((vh) => (
                  <TableRow key={vh.vehicle.id}>
                    <TableCell className="font-medium">{vh.vehicle.model}</TableCell>
                    <TableCell>{vh.vehicle.plate}</TableCell>
                    <TableCell className="text-right">{vh.totalDistance.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{vh.totalFuel.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{vh.averageEfficiency}</TableCell>
                    <TableCell className="text-right">{vh.bestEfficiency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
