import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileImageSection from "./ProfileImageSection";
import ProfileForm from "./ProfileForm";

const CreatorProfileSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
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
        firstName: profileData?.first_name || "",
        lastName: profileData?.last_name || "",
        bio: creatorData?.bio || "",
        location: creatorData?.location || "",
        instagram: creatorData?.instagram || "",
        website: creatorData?.website || "",
        skills: creatorData?.specialties || [],
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile data",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: creatorError } = await supabase
        .from('creators')
        .update({
          bio: profileData.bio,
          location: profileData.location,
          instagram: profileData.instagram,
          website: profileData.website,
          specialties: profileData.skills,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      if (creatorError) throw creatorError;

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-8">
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
    </Card>
  );
};

export default CreatorProfileSettings;