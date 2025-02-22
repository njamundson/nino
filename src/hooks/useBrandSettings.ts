import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BrandSettings } from "@/types/brand";

export const useBrandSettings = () => {
  const [brandData, setBrandData] = useState<BrandSettings>({
    user_id: "",
    company_name: "",
    brand_type: "",
    description: "",
    website: null,
    instagram: null,
    location: "",
    phone_number: null,
    support_email: null,
    profile_image_url: null,
    sms_notifications_enabled: false,
    two_factor_enabled: false,
    email_notifications_enabled: true,
    push_notifications_enabled: true,
    application_notifications_enabled: true,
    message_notifications_enabled: true,
    marketing_notifications_enabled: false
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateBrandSettings = useMutation({
    mutationFn: async (formData: FormData) => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: brand, error: brandError } = await supabase
          .from("brands")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (brandError) throw brandError;
        if (!brand) {
          toast({
            title: "Error",
            description: "Brand profile not found",
            variant: "destructive",
          });
          return;
        }

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
          .eq("id", brand.id);

        if (error) throw error;
        return updatedData;
      } catch (error) {
        console.error("Error updating brand settings:", error);
        throw error;
      }
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

  const handleUpdateField = (field: string, value: any) => {
    setBrandData((prev) => ({ ...prev, [field]: value }));
  };

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
    handleUpdateField,
  };
};