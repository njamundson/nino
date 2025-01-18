import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkCreatorAccess = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Access denied",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Get user's profile first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        console.error("Profile not found");
        toast({
          title: "Error",
          description: "User profile not found.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // Check if user has a creator profile
      const { data: creator, error } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error checking creator profile:", error);
        toast({
          title: "Error",
          description: "Failed to verify creator access. Please try again.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      // If no creator profile exists, create one
      if (!creator) {
        const { error: createError } = await supabase
          .from('creators')
          .insert({
            user_id: session.user.id,
            profile_id: profile.id,
          });

        if (createError) {
          console.error("Error creating creator profile:", createError);
          toast({
            title: "Error",
            description: "Failed to create creator profile. Please try again.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        // Redirect to onboarding to complete profile
        navigate('/onboarding');
        return;
      }
    };

    checkCreatorAccess();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default ProtectedCreatorRoute;