import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const ProtectedCreatorRoute = () => {
  const [isCreator, setIsCreator] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkCreatorAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsCreator(false);
          setLoading(false);
          return;
        }

        const { data: creator, error } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking creator profile:', error);
          toast({
            title: "Error",
            description: "Failed to verify creator access. Please try again.",
            variant: "destructive",
          });
          setIsCreator(false);
        } else {
          setIsCreator(!!creator);
          if (creator) {
            console.log("Creator profile found");
          }
        }
      } catch (error) {
        console.error('Error in checkCreatorAccess:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
        setIsCreator(false);
      } finally {
        setLoading(false);
      }
    };

    checkCreatorAccess();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  return isCreator ? <Outlet /> : <Navigate to="/welcome" replace />;
};

export default ProtectedCreatorRoute;