import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SkillsSelection from "../../onboarding/creator/professional-info/SkillsSelection";

interface ProfileFormProps {
  isEditing: boolean;
  loading: boolean;
  profileData: {
    display_name: string;
    bio: string;
    location: string;
    instagram: string;
    website: string;
    skills: string[];
  };
  onUpdateField: (field: string, value: string) => void;
  onUpdateSkills: (skills: string[]) => void;
}

const ProfileForm = ({
  isEditing,
  loading,
  profileData,
  onUpdateField,
  onUpdateSkills,
}: ProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={profileData.display_name}
          onChange={(e) => onUpdateField("display_name", e.target.value)}
          disabled={!isEditing || loading}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profileData.bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          disabled={!isEditing || loading}
          className="bg-white/50 resize-none h-32"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={profileData.location}
          onChange={(e) => onUpdateField("location", e.target.value)}
          disabled={!isEditing || loading}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram Username</Label>
        <Input
          id="instagram"
          value={profileData.instagram}
          onChange={(e) => onUpdateField("instagram", e.target.value)}
          disabled={!isEditing || loading}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={profileData.website}
          onChange={(e) => onUpdateField("website", e.target.value)}
          disabled={!isEditing || loading}
          className="bg-white/50"
        />
      </div>

      {isEditing && (
        <div className="space-y-2">
          <SkillsSelection
            skills={profileData.skills}
            onUpdateSkills={onUpdateSkills}
            disabled={loading}
          />
        </div>
      )}
    </div>
  );
};

export default ProfileForm;