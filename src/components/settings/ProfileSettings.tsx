import { Card } from "@/components/ui/card";
import ProfileHeader from "./profile/ProfileHeader";
import ProfileAvatar from "./profile/ProfileAvatar";
import ProfileForm from "./profile/ProfileForm";
import SaveButton from "./profile/SaveButton";
import { useProfileData } from "./profile/useProfileData";

const ProfileSettings = () => {
  const {
    isEditing,
    setIsEditing,
    loading,
    profileData,
    setProfileData,
    handleSave,
  } = useProfileData();

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