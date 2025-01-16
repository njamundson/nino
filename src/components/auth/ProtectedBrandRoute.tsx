import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  // Temporarily disable auth checks for development
  return <>{children}</>;

  // Original authentication logic commented out for now
  /*
  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: brand, isLoading, error } = useQuery({
    queryKey: ["brand-profile"],
    enabled: !!session?.user,
    queryFn: async () => {
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (!session) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  if (error) {
    console.error("Error in ProtectedBrandRoute:", error);
    return <Navigate to="/onboarding" />;
  }

  if (!brand) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
  */
};

export default ProtectedBrandRoute;