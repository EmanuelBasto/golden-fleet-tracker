
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
  const [vehicles] = useState<Vehicle[]>(mockVehicles);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [tripData, setTripData] = useState<TripData>(initialTripData);

  // Load saved data from localStorage
  useEffect(() => {
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
    if (currentVehicle) {
      localStorage.setItem('currentVehicle', JSON.stringify(currentVehicle));
    } else {
      localStorage.removeItem('currentVehicle');
    }
  }, [currentVehicle]);

  useEffect(() => {
    localStorage.setItem('tripData', JSON.stringify(tripData));
  }, [tripData]);

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
    finishTrip
  };

  return <VehicleContext.Provider value={value}>{children}</VehicleContext.Provider>;
};
