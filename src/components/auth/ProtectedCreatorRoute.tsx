import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: creator, isLoading: creatorLoading, error: creatorError } = useQuery({
    queryKey: ["creator-profile"],
    enabled: !!session?.user,
    queryFn: async () => {
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", session.user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching creator:", error);
        throw error;
      }

      return data;
    },
  });

  if (sessionLoading || creatorLoading) {
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

  if (creatorError) {
    console.error("Error in ProtectedCreatorRoute:", creatorError);
    return <Navigate to="/onboarding" />;
  }

  if (!creator) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;