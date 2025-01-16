import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserTypeSelection from "./components/onboarding/UserTypeSelection";
import BrandOnboarding from "./components/onboarding/BrandOnboarding";
import AccountManagersStep from "./components/onboarding/brand/managers/AccountManagersStep";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import ProtectedCreatorRoute from "./components/auth/ProtectedCreatorRoute";
import PaymentStep from "./components/onboarding/creator/PaymentStep";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/onboarding" element={<UserTypeSelection />} />
          <Route path="/onboarding/creator" element={<PaymentStep />} />
          <Route path="/onboarding/brand" element={<BrandOnboarding />} />
          <Route
            path="/onboarding/brand/managers"
            element={<AccountManagersStep />}
          />
          <Route 
            path="/welcome" 
            element={
              <ProtectedCreatorRoute>
                <Welcome />
              </ProtectedCreatorRoute>
            } 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedCreatorRoute>
                <Dashboard />
              </ProtectedCreatorRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;