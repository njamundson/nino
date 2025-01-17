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

  // Add auth state change listener with improved error handling
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted');
        toast({
          title: "Session ended",
          description: "Please sign in again to continue.",
        });
        return;
      }

      // Verify session is valid
      if (session) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('Error verifying user:', userError);
          toast({
            title: "Authentication Error",
            description: "Please sign in again to continue.",
            variant: "destructive",
          });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
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
      
      // Verify user exists
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Error verifying user:", userError);
        throw new Error("User verification failed");
      }
      
      console.log("Session fetched:", session);
      return session;
    },
    retry: false, // Don't retry on auth errors
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: brand, isLoading: brandLoading, error: brandError } = useQuery({
    queryKey: ["brand-profile"],
    enabled: !!session?.user,
    queryFn: async () => {
      if (!session?.user) return null;

      console.log("Fetching brand profile...");
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching brand profile:", error);
        throw error;
      }
      
      console.log("Brand profile fetched:", data);
      return data;
    },
    retry: false,
  });

  // Handle session error
  if (sessionError) {
    console.error("Session error:", sessionError);
    toast({
      title: "Authentication Error",
      description: "There was a problem verifying your session. Please try signing in again.",
      variant: "destructive",
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Handle brand error
  if (brandError && session) {
    console.error("Brand error:", brandError);
    toast({
      title: "Error",
      description: "There was a problem loading your brand profile.",
      variant: "destructive",
    });
  }

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