import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProfileWithAvatar } from '@/types/profile';

export const useProfile = () => {
  return useQuery<ProfileWithAvatar | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      // First get the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Then get the brand associated with this user
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        console.error('Error fetching brand:', brandError);
        return profileData;
      }

      // Get the avatar URL if brand exists
      let avatarUrl = '';
      if (brandData?.id) {
        const { data: avatarData } = await supabase
          .storage
          .from('avatars')
          .list(`${brandData.id}`);

        const avatarFile = avatarData?.[0];
        
        if (avatarFile) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(`${brandData.id}/${avatarFile.name}`);
          avatarUrl = publicUrl;
        }
      }
      
      return { ...profileData, avatarUrl } as ProfileWithAvatar;
    }
  });
};