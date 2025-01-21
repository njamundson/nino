import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandType } from "@/types/brand";

interface BrandData {
  company_name: string;
  brand_type: BrandType;
  description: string;
  website: string | null;
  instagram: string | null;
  location: string;
  phone_number: string | null;
  support_email: string | null;
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
}

interface LoginHistory {
  id: string;
  login_timestamp: string;
  ip_address: string;
  device_info: string;
}

export const useBrandSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [brandData, setBrandData] = useState<BrandData>({
    company_name: "",
    brand_type: "hotel",
    description: "",
    website: null,
    instagram: null,
    location: "",
    phone_number: null,
    support_email: null,
    sms_notifications_enabled: false,
    two_factor_enabled: false,
  });

  const fetchBrandData = async () => {
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

      // Fetch brand data
      const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (brand) {
        setBrandData({
          company_name: brand.company_name,
          brand_type: brand.brand_type,
          description: brand.description,
          website: brand.website,
          instagram: brand.instagram,
          location: brand.location,
          phone_number: brand.phone_number,
          support_email: brand.support_email,
          sms_notifications_enabled: brand.sms_notifications_enabled || false,
          two_factor_enabled: brand.two_factor_enabled || false,
        });
        setProfileImage(brand.profile_image_url);
      }

      // Fetch login history
      const { data: history, error: historyError } = await supabase
        .from('brand_login_history')
        .select('*')
        .eq('brand_id', brand.id)
        .order('login_timestamp', { ascending: false })
        .limit(5);

      if (historyError) throw historyError;
      
      setLoginHistory(history || []);
    } catch (error) {
      console.error('Error fetching brand data:', error);
      toast({
        title: "Error",
        description: "Failed to load brand data",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
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
          sms_notifications_enabled: brandData.sms_notifications_enabled,
          two_factor_enabled: brandData.two_factor_enabled,
          profile_image_url: profileImage,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Brand profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating brand:', error);
      toast({
        title: "Error",
        description: "Failed to update brand profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandData();
  }, []);

  return {
    loading,
    profileImage,
    brandData,
    loginHistory,
    setProfileImage,
    setBrandData,
    handleSave,
  };
};