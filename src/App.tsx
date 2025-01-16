import { StrictMode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { BrandRoutes } from "./routes/brandRoutes";
import { CreatorRoutes } from "./routes/creatorRoutes";
import { OnboardingRoutes } from "./routes/onboardingRoutes";

const queryClient = new QueryClient();

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <OnboardingRoutes />
              <BrandRoutes />
              <CreatorRoutes />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  );
};

export default App;