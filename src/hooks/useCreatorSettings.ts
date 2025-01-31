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
    bio: null,
    location: null,
    specialties: [],
    instagram: null,
    website: null,
    profile_image_url: null,
    creator_type: 'solo',
    notifications_enabled: true,
    onboarding_completed: false
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
            display_name: creator.display_name,
            bio: creator.bio,
            location: creator.location,
            specialties: creator.specialties,
            instagram: creator.instagram,
            website: creator.website,
            profile_image_url: creator.profile_image_url,
            creator_type: creator.creator_type as CreatorType,
            notifications_enabled: creator.notifications_enabled,
            onboarding_completed: creator.onboarding_completed
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

  const handleSave = async () => {
    setLoading(true);
    try {
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
          notifications_enabled: creatorData.notifications_enabled,
          onboarding_completed: creatorData.onboarding_completed
        })
        .eq('user_id', user.id);

      if (error) throw error;

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
    creatorData,
    setProfileImage,
    setCreatorData,
    handleSave,
  };
};