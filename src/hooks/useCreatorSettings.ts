import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCreatorSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [creatorData, setCreatorData] = useState({
    display_name: "",
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

        // Get creator data first
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) {
          console.error('Error fetching creator:', creatorError);
          throw creatorError;
        }

        if (creator) {
          setCreatorData({
            display_name: creator.display_name || "",
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

      // Get creator record
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (creatorError) throw creatorError;
      if (!creator) throw new Error('Creator profile not found');

      // Update creator
      const { error: updateError } = await supabase
        .from('creators')
        .update({
          display_name: creatorData.display_name,
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