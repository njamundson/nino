import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkBrandAccess = async () => {
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

      // Check if user has a brand profile
      const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error || !brand) {
        toast({
          title: "Access denied",
          description: "You need a brand profile to access this area.",
          variant: "destructive",
        });
        navigate('/onboarding');
        return;
      }
    };

    checkBrandAccess();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default ProtectedBrandRoute;