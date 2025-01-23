import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CampaignFormData {
  title: string;
  description: string;
  requirements: string[];
  perks: string[];
  deliverables: string[];
  location: string;
  payment_details: string;
  compensation_details: string;
  start_date: string | null;
  end_date: string | null;
}

export const useCampaignSubmit = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const submitCampaign = async (formData: CampaignFormData, uploadedImage: string | null) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Auth error:", userError);
        toast({
          title: "Authentication Error",
          description: "Please sign in again.",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      // Get the brand_id for the current user
      const { data: brandData, error: brandError } = await supabase
        .from("brands")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (brandError) {
        console.error("Brand error:", brandError);
        throw brandError;
      }
      
      if (!brandData) {
        toast({
          title: "Error",
          description: "No brand found for user",
          variant: "destructive",
        });
        return;
      }

      const campaignData = {
        brand_id: brandData.id,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        perks: formData.perks,
        deliverables: formData.deliverables,
        location: formData.location,
        payment_details: formData.payment_details,
        compensation_details: formData.compensation_details,
        start_date: formData.start_date,
        end_date: formData.end_date,
        image_url: uploadedImage,
        status: 'open'
      };

      const { error: insertError } = await supabase
        .from("opportunities")
        .insert(campaignData);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      setIsSuccessModalOpen(true);

    } catch (error) {
      console.error("Error submitting campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    submitCampaign,
  };
};