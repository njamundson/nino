import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BrandData } from "@/types/brand";

export const useBrandOnboarding = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [brandData, setBrandData] = useState<BrandData>({
    company_name: '',
    brand_type: '',
    description: '',
    website: null,
    instagram: null,
    location: '',
    phone_number: null,
    support_email: null,
    profile_image_url: null,
    sms_notifications_enabled: false,
    two_factor_enabled: false
  });

  const onUpdateField = (field: string, value: any) => {
    setBrandData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('brands')
        .insert([brandData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Brand created successfully!",
      });
    } catch (error) {
      console.error("Error creating brand:", error);
      toast({
        title: "Error",
        description: "Failed to create brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    brandData,
    onUpdateField,
    onSubmit,
  };
};
