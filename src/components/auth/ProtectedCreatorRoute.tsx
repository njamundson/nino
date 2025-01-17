interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  // Temporarily return children directly without any checks
  return <>{children}</>;
};

export default ProtectedCreatorRoute;