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
        
        if (brandError) {
          console.error('Error fetching brand profile:', brandError);
          return null;
        }

        return brandData as BrandSettings;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data as UserProfile;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};