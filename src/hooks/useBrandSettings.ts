import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useBrandSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  const [brandData, setBrandData] = useState({
    company_name: "",
    brand_type: "hotel",
    description: "",
    website: "",
    instagram: "",
    location: "",
    phone_number: "",
    support_email: "",
    sms_notifications_enabled: false,
    two_factor_enabled: false,
  });

  const fetchLoginHistory = async (brandId: string) => {
    try {
      const { data: history, error } = await supabase
        .from('brand_login_history')
        .select('*')
        .eq('brand_id', brandId)
        .order('login_timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;
      setLoginHistory(history || []);
    } catch (error) {
      console.error('Error fetching login history:', error);
    }
  };

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

      const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      
      if (brand) {
        setBrandData({
          company_name: brand.company_name || "",
          brand_type: brand.brand_type || "hotel",
          description: brand.description || "",
          website: brand.website || "",
          instagram: brand.instagram || "",
          location: brand.location || "",
          phone_number: brand.phone_number || "",
          support_email: brand.support_email || "",
          sms_notifications_enabled: brand.sms_notifications_enabled || false,
          two_factor_enabled: brand.two_factor_enabled || false,
        });
        setProfileImage(brand.profile_image_url);
        await fetchLoginHistory(brand.id);
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
          ...brandData,
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