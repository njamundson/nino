import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UserTypeSelection from "./components/onboarding/UserTypeSelection";
import CreatorOnboarding from "./components/onboarding/CreatorOnboarding";
import BrandOnboarding from "./components/onboarding/BrandOnboarding";
import AccountManagersStep from "./components/onboarding/brand/managers/AccountManagersStep";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProtectedCreatorRoute from "./components/auth/ProtectedCreatorRoute";
import CreatorLayout from "./components/layouts/CreatorLayout";

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
          <Route path="/onboarding/creator" element={<CreatorOnboarding />} />
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
                <CreatorLayout>
                  <Dashboard />
                </CreatorLayout>
              </ProtectedCreatorRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedCreatorRoute>
                <CreatorLayout>
                  <Projects />
                </CreatorLayout>
              </ProtectedCreatorRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;