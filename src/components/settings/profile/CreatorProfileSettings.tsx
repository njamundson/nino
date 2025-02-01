import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileImageSection from "./ProfileImageSection";
import ProfileForm from "./ProfileForm";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CreatorProfileSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    display_name: "",
    bio: "",
    location: "",
    instagram: "",
    website: "",
    skills: [] as string[],
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (creatorError) throw creatorError;

      setProfileData({
        display_name: profileData?.display_name || "",
        bio: creatorData?.bio || "",
        location: creatorData?.location || "",
        instagram: creatorData?.instagram || "",
        website: creatorData?.website || "",
        skills: creatorData?.specialties || [],
      });
      setProfileImage(creatorData?.profile_image_url);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: profileData.display_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (creatorError) throw creatorError;
      if (!creator) throw new Error('Creator profile not found');

      const { error: updateError } = await supabase
        .from('creators')
        .update({
          bio: profileData.bio,
          location: profileData.location,
          instagram: profileData.instagram,
          website: profileData.website,
          specialties: profileData.skills,
          profile_image_url: profileImage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', creator.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
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

  return (
    <div className="space-y-6">
      <ProfileImageSection 
        profileImage={profileImage} 
        setProfileImage={setProfileImage}
      />

      <ProfileForm
        isEditing={isEditing}
        loading={loading}
        profileData={profileData}
        onUpdateField={handleUpdateField}
        onUpdateSkills={(skills) => handleUpdateField("skills", skills)}
      />

      <div className="flex justify-end space-x-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              onClick={() => setIsEditing(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-nino-primary hover:bg-nino-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </>
        ) : (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-nino-primary hover:bg-nino-primary/90"
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatorProfileSettings;