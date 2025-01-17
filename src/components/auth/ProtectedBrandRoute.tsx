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

  // Add auth state change listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        console.log('User signed out or deleted');
        await supabase.auth.signOut(); // Ensure clean signout
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

  const { data: session, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      console.log("Fetching session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error fetching session:", error);
        // If we get a user_not_found error, sign out the user
        if (error.message.includes("User from sub claim in JWT does not exist")) {
          await supabase.auth.signOut();
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive",
          });
        }
        throw error;
      }
      
      if (!session) {
        throw new Error("No session found");
      }
      
      console.log("Session fetched:", session);
      return session;
    },
    retry: false, // Don't retry on auth errors
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
    retry: false, // Don't retry on data errors
  });

  // Handle session error
  if (sessionError) {
    console.error("Session error:", sessionError);
    // Clean up the session if we get a user_not_found error
    if (sessionError.message.includes("User from sub claim in JWT does not exist")) {
      supabase.auth.signOut();
    }
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