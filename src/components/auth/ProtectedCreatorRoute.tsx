import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Check for access token in URL hash
    if (location.hash.includes('access_token=')) {
      const token = location.hash.split('access_token=')[1];
      // Set the session using the token
      supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    }
  }, [location]);

  const { data: creator, isLoading } = useQuery({
    queryKey: ['creator-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: creator } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return creator;
    },
  });

  useEffect(() => {
    if (!isLoading && !creator) {
      toast({
        title: "Access Denied",
        description: "Please complete your creator profile first.",
        variant: "destructive",
      });
    }
  }, [creator, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-nino-bg flex items-center justify-center">
        <div className="text-nino-primary">Loading...</div>
      </div>
    );
  }

  if (!creator) {
    return <Navigate to="/onboarding/creator" replace />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;