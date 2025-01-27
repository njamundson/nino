import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthCheck } from "@/hooks/use-auth-check";

interface ProtectedBrandRouteProps {
  children: ReactNode;
}

const ProtectedBrandRoute: React.FC<ProtectedBrandRouteProps> = ({ children }) => {
  const { isLoading, hasAccess } = useAuthCheck();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;