import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBrandProfile } from "@/hooks/useBrandProfile";
import { useToast } from "@/hooks/use-toast";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { data: brandProfile, isLoading } = useBrandProfile(session?.user?.id);

  if (!session) {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>; // You might want to replace this with a proper loading component
  }

  if (!brandProfile && !location.pathname.includes("/onboarding")) {
    toast({
      title: "Profile required",
      description: "Please complete your brand profile first",
    });
    return <Navigate to="/onboarding/brand" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;