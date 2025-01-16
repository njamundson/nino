import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileAvatar from "./profile/ProfileAvatar";
import ProfileForm from "./profile/ProfileForm";
import SaveButton from "./profile/SaveButton";

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    instagram: "",
    website: "",
    skills: [] as string[],
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch creator data
      const { data: creatorData } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData && creatorData) {
        setProfileData({
          firstName: profileData.first_name || "",
          lastName: profileData.last_name || "",
          bio: creatorData.bio || "",
          location: creatorData.location || "",
          instagram: creatorData.instagram || "",
          website: creatorData.website || "",
          skills: creatorData.specialties || [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update profiles table
      await supabase
        .from('profiles')
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      // Update creators table
      await supabase
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

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateField = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
      <ProfileHeader 
        isEditing={isEditing}
        loading={loading}
        onEditToggle={() => setIsEditing(!isEditing)}
      />

      <div className="space-y-6">
        <ProfileAvatar
          firstName={profileData.firstName}
          lastName={profileData.lastName}
        />

        <ProfileForm
          isEditing={isEditing}
          loading={loading}
          profileData={profileData}
          onUpdateField={handleUpdateField}
          onUpdateSkills={(skills) => setProfileData(prev => ({ ...prev, skills }))}
        />

        {isEditing && (
          <SaveButton
            loading={loading}
            onSave={handleSave}
          />
        )}
      </div>
    </Card>
  );
};

export default ProfileSettings;