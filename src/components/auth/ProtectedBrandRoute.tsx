import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBrandProfile } from "@/hooks/useBrandProfile";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const { session, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const { data: brandProfile, isLoading: profileLoading } = useBrandProfile(session?.user?.id);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (!session) {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this page",
      variant: "destructive",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
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