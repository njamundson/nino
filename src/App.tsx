import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { brandRoutes } from "./routes/brandRoutes";
import { creatorRoutes } from "./routes/creatorRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { adminRoutes } from "./routes/adminRoutes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Temporarily disabled auth checks for frontend development
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  // We'll re-implement auth checks later
  return children;
};

const router = createBrowserRouter([
  ...brandRoutes,
  ...creatorRoutes,
  ...onboardingRoutes,
  ...adminRoutes,
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <RouterProvider router={router} />
        <Toaster />
      </AuthWrapper>
    </QueryClientProvider>
  );
};

export default App;