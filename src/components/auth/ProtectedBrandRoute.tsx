import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: brand, isLoading: brandLoading, error: brandError } = useQuery({
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
        console.error("Error fetching brand:", error);
        throw error;
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
    return <Navigate to="/" />;
  }

  if (brandError) {
    console.error("Error in ProtectedBrandRoute:", brandError);
    return <Navigate to="/onboarding" />;
  }

  if (!brand) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;