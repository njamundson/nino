import React from "react";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  // In development mode, we'll always render the children
  return <>{children}</>;
};

export default ProtectedCreatorRoute;