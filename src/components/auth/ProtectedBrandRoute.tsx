import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const location = useLocation();
  const { toast } = useToast();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      console.log("Fetching session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error);
        throw error;
      }
      
      if (!session) {
        console.log("No active session found");
        return null;
      }
      
      console.log("Session fetched successfully:", session);
      return session;
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["brand-profile"],
    enabled: !!session?.user,
    queryFn: async () => {
      if (!session?.user) return null;

      console.log("Fetching brand profile...");
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle(); // Changed from .single() to .maybeSingle()
      
      if (error) {
        console.error("Error fetching brand profile:", error);
        throw error;
      }
      
      console.log("Brand profile fetched:", data);
      return data;
    },
    retry: false,
  });

  // Add auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        toast({
          title: "Session ended",
          description: "Please sign in again to continue.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  if (sessionLoading || brandLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  if (!session) {
    console.log("No session, redirecting to home");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If we're already on the onboarding page, don't redirect
  if (!brand && !location.pathname.includes('/onboarding')) {
    console.log("No brand profile, redirecting to onboarding");
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If we have a brand and we're on the onboarding page, redirect to dashboard
  if (brand && location.pathname.includes('/onboarding')) {
    console.log("Brand exists, redirecting to dashboard");
    return <Navigate to="/brand/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;