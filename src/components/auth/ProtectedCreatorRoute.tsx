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
      console.log("Fetching session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error);
        return null;
      }
      
      console.log("Session fetched:", session);
      return session;
    },
  });

  const { data: creator, isLoading: creatorLoading } = useQuery({
    queryKey: ["creator-profile"],
    enabled: !!session?.user,
    queryFn: async () => {
      if (!session?.user) return null;

      console.log("Fetching creator profile...");
      const { data, error } = await supabase
        .from("creators")
        .select(`
          *,
          profile:profiles(
            first_name,
            last_name
          )
        `)
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching creator profile:", error);
        return null;
      }
      
      console.log("Creator profile fetched:", data);
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
    console.log("No session, redirecting to home");
    return <Navigate to="/" />;
  }

  if (!creator) {
    console.log("No creator profile, redirecting to onboarding");
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;