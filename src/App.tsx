
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { VehicleProvider } from "@/context/VehicleContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VehicleRegistration from "./pages/VehicleRegistration";
import StartPoint from "./pages/StartPoint";
import Destination from "./pages/Destination";
import InUse from "./pages/InUse";
import RefuelPage from "./pages/RefuelPage";
import EndUsage from "./pages/EndUsage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <VehicleProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/vehicle-registration" 
                element={
                  <ProtectedRoute>
                    <VehicleRegistration />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/start-point" 
                element={
                  <ProtectedRoute>
                    <StartPoint />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/destination" 
                element={
                  <ProtectedRoute>
                    <Destination />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/in-use" 
                element={
                  <ProtectedRoute>
                    <InUse />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/refuel" 
                element={
                  <ProtectedRoute>
                    <RefuelPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/end-usage" 
                element={
                  <ProtectedRoute>
                    <EndUsage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </VehicleProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
