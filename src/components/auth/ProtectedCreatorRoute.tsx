import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const { toast } = useToast();
  const location = useLocation();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: creator, isLoading: creatorLoading } = useQuery({
    queryKey: ["creator-profile", session?.user?.id],
    enabled: !!session?.user,
    queryFn: async () => {
      if (!session?.user) return null;

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching creator profile:", error);
        toast({
          title: "Error",
          description: "Failed to fetch creator profile",
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    },
  });

  if (sessionLoading || creatorLoading) {
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

  // Allow access to onboarding routes even without a creator profile
  if (!creator && !location.pathname.includes("/onboarding")) {
    toast({
      title: "Profile required",
      description: "Please complete your creator profile first",
    });
    return <Navigate to="/onboarding/creator" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;