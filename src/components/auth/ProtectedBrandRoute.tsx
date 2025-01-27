import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthCheck } from "@/hooks/use-auth-check";

interface ProtectedBrandRouteProps {
  children: ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const { isAuthenticated, isLoading, isBrand } = useAuthCheck();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  if (!isBrand) {
    return <Navigate to="/creator/dashboard" />;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;