import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CreatorData, CreatorType } from "@/types/creator";

export const useCreatorSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: '',
    user_id: '',
    display_name: '',
    bio: '',
    location: '',
    specialties: [],
    instagram: '',
    website: '',
    profile_image_url: null,
    creator_type: 'solo',
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: creator, error } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (creator) {
          setCreatorData({
            id: creator.id,
            user_id: creator.user_id,
            display_name: creator.display_name || '',
            bio: creator.bio || '',
            location: creator.location || '',
            specialties: creator.specialties || [],
            instagram: creator.instagram || '',
            website: creator.website || '',
            profile_image_url: creator.profile_image_url,
            creator_type: creator.creator_type as CreatorType || 'solo',
            notifications_enabled: creator.notifications_enabled,
          });
          setProfileImage(creator.profile_image_url);
        }
      } catch (error) {
        console.error('Error fetching creator data:', error);
        toast({
          title: "Error",
          description: "Failed to load creator data",
          variant: "destructive",
        });
      }
    };

    fetchCreatorData();
  }, [toast]);

  return {
    loading,
    profileImage,
    creatorData,
    setProfileImage,
    setCreatorData,
  };
};