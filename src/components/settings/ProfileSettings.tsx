import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SkillsSelection from "../onboarding/creator/professional-info/SkillsSelection";

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

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-nino-text">Profile Information</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          disabled={loading}
          className="text-nino-primary"
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback>
              {profileData.firstName.charAt(0)}
              {profileData.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              disabled={!isEditing || loading}
              className="bg-white/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              disabled={!isEditing || loading}
              className="bg-white/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={profileData.bio}
            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
            disabled={!isEditing || loading}
            className="bg-white/50 resize-none h-32"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profileData.location}
            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
            disabled={!isEditing || loading}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram Username</Label>
          <Input
            id="instagram"
            value={profileData.instagram}
            onChange={(e) => setProfileData(prev => ({ ...prev, instagram: e.target.value }))}
            disabled={!isEditing || loading}
            className="bg-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={profileData.website}
            onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
            disabled={!isEditing || loading}
            className="bg-white/50"
          />
        </div>

        {isEditing && (
          <div className="space-y-2">
            <SkillsSelection
              skills={profileData.skills}
              onUpdateSkills={(skills) => setProfileData(prev => ({ ...prev, skills }))}
            />
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={loading}
              className="bg-nino-primary hover:bg-nino-primary/90"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileSettings;