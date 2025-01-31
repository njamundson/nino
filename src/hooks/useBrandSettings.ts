import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BrandSettings } from "@/types/brand";

export const useBrandSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandSettings>({
    id: '',
    user_id: '',
    company_name: '',
    brand_type: '',
    description: '',
    website: null,
    instagram: null,
    location: '',
    phone_number: null,
    support_email: null,
    profile_image_url: null,
    push_enabled: true,
    email_enabled: true,
    message_notifications: true,
    application_updates: true,
    marketing_updates: false,
    sms_notifications_enabled: true,
    two_factor_enabled: false,
    onboarding_completed: false
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: brand, error } = await supabase
          .from('brands')
          .select(`
            *,
            brand_notification_settings (*)
          `)
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (brand) {
          const notificationSettings = brand.brand_notification_settings?.[0] || {};
          setBrandData({
            ...brand,
            push_enabled: notificationSettings.push_enabled ?? true,
            email_enabled: notificationSettings.email_enabled ?? true,
            message_notifications: notificationSettings.message_notifications ?? true,
            application_updates: notificationSettings.application_updates ?? true,
            marketing_updates: notificationSettings.marketing_updates ?? false,
          });
          setProfileImage(brand.profile_image_url);
        }
      } catch (error) {
        console.error('Error fetching brand data:', error);
        toast({
          title: "Error",
          description: "Failed to load brand data",
          variant: "destructive",
        });
      }
    };

    fetchBrandData();
  }, [toast]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error: brandError } = await supabase
        .from('brands')
        .update({
          company_name: brandData.company_name,
          brand_type: brandData.brand_type,
          description: brandData.description,
          website: brandData.website,
          instagram: brandData.instagram,
          location: brandData.location,
          phone_number: brandData.phone_number,
          support_email: brandData.support_email,
          profile_image_url: profileImage,
          sms_notifications_enabled: brandData.sms_notifications_enabled,
          two_factor_enabled: brandData.two_factor_enabled,
          onboarding_completed: brandData.onboarding_completed
        })
        .eq('user_id', user.id);

      if (brandError) throw brandError;

      const { error: notificationError } = await supabase
        .from('brand_notification_settings')
        .upsert({
          brand_id: brandData.id,
          push_enabled: brandData.push_enabled,
          email_enabled: brandData.email_enabled,
          message_notifications: brandData.message_notifications,
          application_updates: brandData.application_updates,
          marketing_updates: brandData.marketing_updates,
        });

      if (notificationError) throw notificationError;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profileImage,
    brandData,
    setProfileImage,
    setBrandData,
    handleSave,
  };
};