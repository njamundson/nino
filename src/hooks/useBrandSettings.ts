import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BrandData, LoginHistory } from '@/types/brand';
import { useToast } from './use-toast';

export const useBrandSettings = () => {
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (brandError) throw brandError;

        if (brandData) {
          setBrandData(brandData);
          setProfileImage(brandData.profile_image_url);

          const { data: historyData, error: historyError } = await supabase
            .from('brand_login_history')
            .select('*')
            .eq('brand_id', brandData.id)
            .order('login_timestamp', { ascending: false })
            .limit(5);

          if (historyError) throw historyError;
          setLoginHistory(historyData || []);
        }
      } catch (error) {
        console.error('Error fetching brand data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load brand settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [toast]);

  const handleSave = async () => {
    if (!brandData) return;

    try {
      setLoading(true);

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
          profile_image_url: profileImage,
          sms_notifications_enabled: brandData.sms_notifications_enabled,
          two_factor_enabled: brandData.two_factor_enabled,
        })
        .eq('id', brandData.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Brand settings updated successfully',
      });
    } catch (error) {
      console.error('Error updating brand data:', error);
      toast({
        title: 'Error',
        description: 'Failed to update brand settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    brandData,
    loginHistory,
    loading,
    profileImage,
    setProfileImage,
    setBrandData,
    handleSave,
  };
};