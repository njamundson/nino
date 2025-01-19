import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkCreatorAccess = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          if (sessionError.message.includes("refresh_token_not_found")) {
            await supabase.auth.signOut();
            toast({
              title: "Session expired",
              description: "Please sign in again to continue.",
              variant: "destructive",
            });
          }
          navigate('/');
          return;
        }

        if (!session) {
          console.log("No session found");
          navigate('/');
          return;
        }

        const userId = session.user?.id;
        if (!userId) {
          console.log("No user ID found in session");
          navigate('/');
          return;
        }

        // Get user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        if (!profile) {
          console.error("Profile not found");
          throw new Error("Profile not found");
        }

        // Check if user has a creator profile
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (creatorError) {
          console.error("Error checking creator profile:", creatorError);
          throw creatorError;
        }

        // If no creator profile exists, create one
        if (!creator) {
          const { error: createError } = await supabase
            .from('creators')
            .insert({
              user_id: userId,
              profile_id: profile.id,
            });

          if (createError) {
            console.error("Error creating creator profile:", createError);
            throw createError;
          }

          navigate('/onboarding');
          return;
        }

        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error in checkCreatorAccess:", error);
        toast({
          title: "Access denied",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    // Initial check
    checkCreatorAccess();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, "Session:", session?.user?.id ? "exists" : "none");
      
      if (event === 'SIGNED_OUT' || !session?.user?.id) {
        console.log("User signed out or no valid session");
        navigate('/');
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        console.log("Token refreshed successfully");
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkCreatorAccess();
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;