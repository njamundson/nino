import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const location = useLocation();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["brand-profile"],
    enabled: !!session?.user,
    queryFn: async () => {
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching brand profile:", error);
        return null;
      }
      
      return data;
    },
  });

  if (sessionLoading || brandLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If we're already on the onboarding page, don't redirect
  if (!brand && !location.pathname.includes('/onboarding')) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If we have a brand and we're on the onboarding page, redirect to dashboard
  if (brand && location.pathname.includes('/onboarding')) {
    return <Navigate to="/brand/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;