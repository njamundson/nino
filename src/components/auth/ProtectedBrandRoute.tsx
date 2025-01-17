interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  // Temporarily return children directly without any checks
  return <>{children}</>;
};

export default ProtectedBrandRoute;