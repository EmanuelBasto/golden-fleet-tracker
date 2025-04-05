
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: number;
  economicNumber: string;
  location: string;
  color: string;
  fleetNumber: string;
  lastKilometers: number;
  lastFuelLevel: number;
  lastMaintenanceDate: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  description?: string;
  photo?: string;
}

export interface TripData {
  vehicle: Vehicle | null;
  startDate: string;
  initialKilometers: number;
  initialKilometerPhoto?: string;
  initialFuelLevel: number;
  lastMaintenanceDate: string;
  startLocation: LocationData | null;
  destination: LocationData | null;
  projectName?: string;
  endLocation?: LocationData;
  finalKilometers?: number;
  finalFuelLevel?: number;
  refuelData?: RefuelData[];
  active: boolean;
}

export interface RefuelData {
  location: LocationData;
  fuelLevel: number;
  amount: number;
  photo?: string;
  date: string;
}

interface VehicleContextType {
  vehicles: Vehicle[];
  currentVehicle: Vehicle | null;
  setCurrentVehicle: (vehicle: Vehicle | null) => void;
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
  resetTripData: () => void;
  addRefuel: (refuel: RefuelData) => void;
  finishTrip: (endLocation: LocationData, finalKilometers: number, finalFuelLevel: number) => void;
  addVehicle: (vehicle: Vehicle) => void;
}

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    plate: 'ABC-123',
    model: 'Toyota Hilux',
    year: 2021,
    economicNumber: 'ECO-001',
    location: 'Ciudad de México',
    color: 'Blanco',
    fleetNumber: 'FL-01',
    lastKilometers: 35000,
    lastFuelLevel: 75,
    lastMaintenanceDate: '2023-12-15'
  },
  {
    id: '2',
    plate: 'XYZ-789',
    model: 'Ford Ranger',
    year: 2022,
    economicNumber: 'ECO-002',
    location: 'Guadalajara',
    color: 'Negro',
    fleetNumber: 'FL-01',
    lastKilometers: 28500,
    lastFuelLevel: 60,
    lastMaintenanceDate: '2024-01-20'
  },
  {
    id: '3',
    plate: 'LMN-456',
    model: 'Nissan NP300',
    year: 2020,
    economicNumber: 'ECO-003',
    location: 'Monterrey',
    color: 'Gris',
    fleetNumber: 'FL-02',
    lastKilometers: 42000,
    lastFuelLevel: 45,
    lastMaintenanceDate: '2023-11-10'
  },
  {
    id: '4',
    plate: 'DEF-987',
    model: 'Chevrolet Silverado',
    year: 2023,
    economicNumber: 'ECO-004',
    location: 'Puebla',
    color: 'Rojo',
    fleetNumber: 'FL-02',
    lastKilometers: 15200,
    lastFuelLevel: 85,
    lastMaintenanceDate: '2024-02-05'
  },
  {
    id: '5',
    plate: 'GHI-654',
    model: 'Volkswagen Amarok',
    year: 2022,
    economicNumber: 'ECO-005',
    location: 'León',
    color: 'Azul',
    fleetNumber: 'FL-03',
    lastKilometers: 31500,
    lastFuelLevel: 50,
    lastMaintenanceDate: '2023-10-22'
  },
  {
    id: '6',
    plate: 'JKL-321',
    model: 'Mitsubishi L200',
    year: 2021,
    economicNumber: 'ECO-006',
    location: 'Querétaro',
    color: 'Verde',
    fleetNumber: 'FL-03',
    lastKilometers: 27800,
    lastFuelLevel: 65,
    lastMaintenanceDate: '2024-01-15'
  },
  {
    id: '7',
    plate: 'MNO-742',
    model: 'Dodge RAM 1500',
    year: 2023,
    economicNumber: 'ECO-007',
    location: 'Tijuana',
    color: 'Negro',
    fleetNumber: 'FL-04',
    lastKilometers: 18700,
    lastFuelLevel: 70,
    lastMaintenanceDate: '2024-02-28'
  },
  {
    id: '8',
    plate: 'PQR-159',
    model: 'Isuzu D-Max',
    year: 2022,
    economicNumber: 'ECO-008',
    location: 'Chihuahua',
    color: 'Plata',
    fleetNumber: 'FL-04',
    lastKilometers: 23400,
    lastFuelLevel: 55,
    lastMaintenanceDate: '2023-12-10'
  },
  {
    id: '9',
    plate: 'STU-853',
    model: 'Mazda BT-50',
    year: 2021,
    economicNumber: 'ECO-009',
    location: 'Mérida',
    color: 'Blanco',
    fleetNumber: 'FL-05',
    lastKilometers: 36800,
    lastFuelLevel: 40,
    lastMaintenanceDate: '2023-11-25'
  },
  {
    id: '10',
    plate: 'VWX-624',
    model: 'GMC Sierra',
    year: 2023,
    economicNumber: 'ECO-010',
    location: 'Cancún',
    color: 'Café',
    fleetNumber: 'FL-05',
    lastKilometers: 12500,
    lastFuelLevel: 90,
    lastMaintenanceDate: '2024-03-10'
  },
  {
    id: '11',
    plate: 'YZA-475',
    model: 'Toyota Tacoma',
    year: 2022,
    economicNumber: 'ECO-011',
    location: 'Toluca',
    color: 'Azul Marino',
    fleetNumber: 'FL-06',
    lastKilometers: 29300,
    lastFuelLevel: 60,
    lastMaintenanceDate: '2024-01-05'
  }
];

const initialTripData: TripData = {
  vehicle: null,
  startDate: new Date().toISOString().split('T')[0],
  initialKilometers: 0,
  initialFuelLevel: 0,
  lastMaintenanceDate: '',
  startLocation: null,
  destination: null,
  active: false,
  refuelData: []
};

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [tripData, setTripData] = useState<TripData>(initialTripData);

  // Load saved data from localStorage
  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    }

    const savedVehicle = localStorage.getItem('currentVehicle');
    if (savedVehicle) {
      setCurrentVehicle(JSON.parse(savedVehicle));
    }

    const savedTripData = localStorage.getItem('tripData');
    if (savedTripData) {
      setTripData(JSON.parse(savedTripData));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    if (currentVehicle) {
      localStorage.setItem('currentVehicle', JSON.stringify(currentVehicle));
    } else {
      localStorage.removeItem('currentVehicle');
    }
  }, [currentVehicle]);

  useEffect(() => {
    localStorage.setItem('tripData', JSON.stringify(tripData));
  }, [tripData]);

  // Add new vehicle
  const addVehicle = (vehicle: Vehicle) => {
    setVehicles(prev => [...prev, vehicle]);
  };

  // Update trip data
  const updateTripData = (data: Partial<TripData>) => {
    setTripData(prev => ({ ...prev, ...data }));
  };

  // Reset trip data
  const resetTripData = () => {
    setTripData(initialTripData);
    setCurrentVehicle(null);
  };

  // Add refuel data
  const addRefuel = (refuel: RefuelData) => {
    setTripData(prev => ({
      ...prev,
      refuelData: [...(prev.refuelData || []), refuel],
      initialFuelLevel: refuel.fuelLevel // Update current fuel level
    }));
  };

  // Finish trip
  const finishTrip = (endLocation: LocationData, finalKilometers: number, finalFuelLevel: number) => {
    setTripData(prev => ({
      ...prev,
      endLocation,
      finalKilometers,
      finalFuelLevel,
      active: false
    }));

    // Update the vehicle's last values
    if (currentVehicle) {
      const updatedVehicle = {
        ...currentVehicle,
        lastKilometers: finalKilometers,
        lastFuelLevel: finalFuelLevel
      };
      setCurrentVehicle(updatedVehicle);
      
      // Also update the vehicle in the vehicles array
      setVehicles(prev => 
        prev.map(v => v.id === currentVehicle.id ? updatedVehicle : v)
      );
    }
  };

  const value = {
    vehicles,
    currentVehicle,
    setCurrentVehicle,
    tripData,
    updateTripData,
    resetTripData,
    addRefuel,
    finishTrip,
    addVehicle
  };

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};
