import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { BrandData, BrandType } from '@/types/brand';
import { useToast } from './use-toast';

export interface LoginHistory {
  id: string;
  login_timestamp: string;
  ip_address: string;
  device_info: string;
}

export const useBrandSettings = () => {
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
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
          setBrandData({
            id: brandData.id,
            userId: brandData.user_id,
            companyName: brandData.company_name,
            brandType: brandData.brand_type as BrandType,
            description: brandData.description,
            website: brandData.website,
            instagram: brandData.instagram,
            location: brandData.location,
            phoneNumber: brandData.phone_number,
            supportEmail: brandData.support_email,
            profileImageUrl: brandData.profile_image_url,
            smsNotificationsEnabled: brandData.sms_notifications_enabled,
            twoFactorEnabled: brandData.two_factor_enabled,
          });

          // Fetch login history
          const { data: historyData, error: historyError } = await supabase
            .from('brand_login_history')
            .select('*')
            .eq('brand_id', brandData.id)
            .order('login_timestamp', { ascending: false })
            .limit(5);

          if (historyError) throw historyError;
          setLoginHistory(historyData as LoginHistory[]);
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

  const updateBrandData = async (updates: Partial<BrandData>) => {
    if (!brandData) return;

    try {
      setLoading(true);

      const { error } = await supabase
        .from('brands')
        .update({
          company_name: updates.companyName,
          brand_type: updates.brandType,
          description: updates.description,
          website: updates.website,
          instagram: updates.instagram,
          location: updates.location,
          phone_number: updates.phoneNumber,
          support_email: updates.supportEmail,
          sms_notifications_enabled: updates.smsNotificationsEnabled,
          two_factor_enabled: updates.twoFactorEnabled,
        })
        .eq('id', brandData.id);

      if (error) throw error;

      setBrandData({ ...brandData, ...updates });
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
    updateBrandData,
  };
};