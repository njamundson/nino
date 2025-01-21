import { ReactNode } from "react";
import { Outlet } from "react-router-dom";

interface ProtectedCreatorRouteProps {
  children?: ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  return children || <Outlet />;
};

export default ProtectedCreatorRoute;