import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface BrandSettings {
  brand_type: string;
  company_name: string;
  description: string;
  website: string;
  instagram: string;
  location: string;
  phone_number: string;
  support_email: string;
  profile_image_url: string;
}

export const useBrandSettings = () => {
  const [brandData, setBrandData] = useState<BrandSettings>({
    brand_type: "",
    company_name: "",
    description: "",
    website: "",
    instagram: "",
    location: "",
    phone_number: "",
    support_email: "",
    profile_image_url: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBrandSettings = useMutation({
    mutationFn: async (formData: FormData) => {
      const updatedData = {
        brand_type: String(formData.get("brand_type") || ""),
        company_name: String(formData.get("company_name") || ""),
        description: String(formData.get("description") || ""),
        website: String(formData.get("website") || ""),
        instagram: String(formData.get("instagram") || ""),
        location: String(formData.get("location") || ""),
        phone_number: String(formData.get("phone_number") || ""),
        support_email: String(formData.get("support_email") || ""),
      };

      const { error } = await supabase
        .from("brands")
        .update(updatedData)
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brandSettings"] });
      toast({
        title: "Success",
        description: "Brand settings updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating brand settings:", error);
      toast({
        title: "Error",
        description: "Failed to update brand settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (formData: FormData) => {
    setLoading(true);
    try {
      await updateBrandSettings.mutateAsync(formData);
    } finally {
      setLoading(false);
    }
  };

  return {
    brandData,
    setBrandData,
    profileImage,
    setProfileImage,
    loading,
    handleSave,
    updateBrandSettings,
  };
};