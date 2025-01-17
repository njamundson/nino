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

      // Check if user has a creator profile
      const { data: creator, error } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !creator) {
        toast({
          title: "Access denied",
          description: "You need a creator profile to access this area.",
          variant: "destructive",
        });
        navigate('/onboarding');
        return;
      }
    };

    checkCreatorAccess();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default ProtectedCreatorRoute;