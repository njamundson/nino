import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  display_name: string;
  bio: string;
  location: string;
  instagram: string;
  website: string;
  skills: string[];
  creatorType: string;
  notifications_enabled?: boolean;
}

export const useProfileData = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: "",
    bio: "",
    location: "",
    instagram: "",
    website: "",
    skills: [],
    creatorType: "solo",
    notifications_enabled: true,
  });
  const { toast } = useToast();

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "No user found. Please sign in.",
          variant: "destructive",
        });
        return;
      }

      // First try to get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      // Then try to get creator data
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        return;
      }

      if (profileData || creatorData) {
        setProfileData({
          display_name: profileData?.display_name || "",
          bio: creatorData?.bio || "",
          location: creatorData?.location || "",
          instagram: creatorData?.instagram || "",
          website: creatorData?.website || "",
          skills: creatorData?.specialties || [],
          creatorType: creatorData?.creator_type || "solo",
          notifications_enabled: creatorData?.notifications_enabled ?? true,
        });
      }
    } catch (error) {
      console.error('Error in fetchProfileData:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return {
    isEditing,
    setIsEditing,
    loading,
    profileData,
    setProfileData,
  };
};