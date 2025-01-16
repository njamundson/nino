import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserTypeSelection from "./components/onboarding/UserTypeSelection";
import CreatorOnboardingFlow from "./components/onboarding/creator/CreatorOnboardingFlow";
import BrandOnboardingFlow from "./components/onboarding/brand/BrandOnboardingFlow";
import AccountManagersStep from "./components/onboarding/brand/managers/AccountManagersStep";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import ProtectedCreatorRoute from "./components/auth/ProtectedCreatorRoute";

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
          <Route path="/onboarding/creator" element={<CreatorOnboardingFlow />} />
          <Route path="/onboarding/brand" element={<BrandOnboardingFlow />} />
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