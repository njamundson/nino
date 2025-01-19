import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useCreatorSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [creatorData, setCreatorData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    instagram: "",
    website: "",
    specialties: [] as string[],
  });

  const fetchCreatorData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch creator data
      const { data: creator } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile && creator) {
        setCreatorData({
          firstName: profile.first_name || "",
          lastName: profile.last_name || "",
          bio: creator.bio || "",
          location: creator.location || "",
          instagram: creator.instagram || "",
          website: creator.website || "",
          specialties: creator.specialties || [],
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
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: creatorData.firstName,
          last_name: creatorData.lastName,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update creator
      const { error: creatorError } = await supabase
        .from('creators')
        .update({
          bio: creatorData.bio,
          location: creatorData.location,
          instagram: creatorData.instagram,
          website: creatorData.website,
          specialties: creatorData.specialties,
          profile_image_url: profileImage,
        })
        .eq('user_id', user.id);

      if (creatorError) throw creatorError;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating creator data:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreatorData();
  }, []);

  return {
    loading,
    profileImage,
    creatorData,
    setProfileImage,
    setCreatorData,
    handleSave,
  };
};