import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useBrandCompletion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async () => {
    try {
      console.log("Starting brand completion process...");
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error getting user:", userError);
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      if (!user) {
        console.error("No user found");
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      console.log("Fetching brand for user:", user.id);

      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id, created_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        console.error("Error fetching brand:", brandError);
        toast({
          title: "Error",
          description: "Could not find brand information",
          variant: "destructive",
        });
        return;
      }

      if (!brand) {
        console.error("Brand not found");
        toast({
          title: "Error",
          description: "Brand profile not found. Please complete the basic information first.",
          variant: "destructive",
        });
        return;
      }

      console.log("Brand found:", brand);

      // Add the brand manager after 5 minutes
      const createdAt = new Date(brand.created_at);
      const fiveMinutesAfterCreation = new Date(createdAt.getTime() + 5 * 60000);
      
      // Schedule the manager invitation
      setTimeout(async () => {
        try {
          const { data: manager, error: managerError } = await supabase
            .from('brand_managers')
            .insert({
              brand_id: brand.id,
              name: user.email?.split('@')[0] || 'Brand Manager',
              email: user.email,
              role: 'Admin',
              permissions: ['post_projects', 'message_creators', 'add_admins'],
              invitation_status: 'pending'
            })
            .select()
            .single();

          if (managerError) {
            console.error("Error creating manager:", managerError);
          } else {
            console.log("Manager invitation created:", manager);
            toast({
              title: "Success",
              description: "You've been invited as a brand manager. Check your email for instructions.",
            });
          }
        } catch (error) {
          console.error("Error in manager invitation:", error);
        }
      }, Math.max(0, fiveMinutesAfterCreation.getTime() - Date.now()));

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