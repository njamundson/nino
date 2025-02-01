import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCreatorSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [creatorData, setCreatorData] = useState({
    displayName: "",
    bio: "",
    location: "",
    instagram: "",
    website: "",
    specialties: [] as string[],
    creatorType: "solo",
    notifications_enabled: false,
  });

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user found');
          return;
        }

        // Get profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        // Get creator data
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (creatorError) {
          console.error('Error fetching creator:', creatorError);
          throw creatorError;
        }

        if (profile && creator) {
          setCreatorData({
            displayName: profile.display_name || "",
            bio: creator.bio || "",
            location: creator.location || "",
            instagram: creator.instagram || "",
            website: creator.website || "",
            specialties: creator.specialties || [],
            creatorType: creator.creator_type || "solo",
            notifications_enabled: creator.notifications_enabled || false,
          });
          setProfileImage(creator.profile_image_url);
        }
      } catch (error) {
        console.error('Error in fetchCreatorData:', error);
        toast({
          title: "Error",
          description: "Failed to load creator data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorData();
  }, [toast]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: creatorData.displayName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Get creator record
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (creatorError) throw creatorError;
      if (!creator) throw new Error('Creator profile not found');

      // Update creator
      const { error: updateError } = await supabase
        .from('creators')
        .update({
          bio: creatorData.bio,
          location: creatorData.location,
          instagram: creatorData.instagram,
          website: creatorData.website,
          specialties: creatorData.specialties,
          creator_type: creatorData.creatorType,
          profile_image_url: profileImage,
          notifications_enabled: creatorData.notifications_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', creator.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error in handleSave:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
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