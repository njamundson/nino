import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CreatorData } from "@/types/creator";

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
            creator_type: creator.creator_type || 'solo',
          });
          setProfileImage(creator.profile_image_url);
        }
      } catch (error) {
        console.error('Error fetching creator data:', error);
        toast.error("Failed to load creator data");
      }
    };

    fetchCreatorData();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('creators')
        .update({
          display_name: creatorData.display_name,
          bio: creatorData.bio,
          location: creatorData.location,
          specialties: creatorData.specialties,
          instagram: creatorData.instagram,
          website: creatorData.website,
          profile_image_url: profileImage,
          creator_type: creatorData.creator_type,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Settings saved successfully");
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profileImage,
    creatorData,
    setProfileImage,
    setCreatorData,
    handleSave,
  };
};