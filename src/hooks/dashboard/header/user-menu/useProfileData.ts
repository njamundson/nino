import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from "react-router-dom";
import { BrandSettings } from '@/types/brand';
import { UserProfile } from '@/types/user';

export const useProfileData = () => {
  const location = useLocation();
  const isBrandDashboard = location.pathname.startsWith("/brand");

  return useQuery<BrandSettings | UserProfile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      if (isBrandDashboard) {
        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (brandError || !brandData) {
          console.error('Error fetching brand profile:', brandError);
          return null;
        }

        return {
          ...brandData,
          email_notifications_enabled: true,
          push_notifications_enabled: true,
          application_notifications_enabled: true,
          message_notifications_enabled: true,
          marketing_notifications_enabled: false,
        } as BrandSettings;
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (profileError || !profileData) {
        console.error('Error fetching profile:', profileError);
        return null;
      }
      
      return {
        id: profileData.id,
        display_name: profileData.display_name || `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        profile_image_url: profileData.profile_image_url,
        created_at: profileData.created_at,
        updated_at: profileData.updated_at,
      } as UserProfile;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};