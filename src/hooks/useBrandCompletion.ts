import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useBrandCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        toast({
          title: "Error",
          description: "Could not find brand information",
          variant: "destructive",
        });
        return;
      }

      if (!brand) {
        toast({
          title: "Error",
          description: "Brand profile not found. Please complete the basic information first.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Brand setup completed successfully",
      });

      navigate("/brand/dashboard");
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return { handleComplete };
};