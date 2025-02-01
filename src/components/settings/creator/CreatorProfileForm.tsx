import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationField from "../../onboarding/creator/basic-info/fields/LocationField";
import SkillsSelection from "../../onboarding/creator/professional-info/SkillsSelection";

interface CreatorProfileFormProps {
  loading: boolean;
  isEditing?: boolean;
  creatorData: {
    display_name: string;
    bio: string;
    location: string;
    instagram: string;
    website: string;
    specialties: string[];
    creatorType: string;
    notifications_enabled?: boolean;
  };
  onUpdateField: (field: string, value: any) => void;
}

const CreatorProfileForm = ({
  loading,
  isEditing = false,
  creatorData,
  onUpdateField,
}: CreatorProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-sm font-medium text-[#282828]">Display Name</Label>
        <Input
          id="displayName"
          value={creatorData.display_name}
          onChange={(e) => onUpdateField("display_name", e.target.value)}
          disabled={loading || !isEditing}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl text-[#282828]"
          placeholder="Enter your display name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-[#282828]">Bio</Label>
        <Textarea
          id="bio"
          value={creatorData.bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          disabled={loading || !isEditing}
          placeholder="Tell your story..."
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl resize-none h-32 text-[#282828]"
        />
      </div>

      <LocationField
        location={creatorData.location}
        onUpdateField={onUpdateField}
        disabled={loading || !isEditing}
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#282828]">Skills & Expertise</Label>
        <SkillsSelection
          skills={creatorData.specialties}
          onUpdateSkills={(skills) => onUpdateField("specialties", skills)}
          disabled={loading || !isEditing}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram" className="text-sm font-medium text-[#282828]">Instagram Username</Label>
        <Input
          id="instagram"
          value={creatorData.instagram}
          onChange={(e) => onUpdateField("instagram", e.target.value)}
          disabled={loading || !isEditing}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl text-[#282828]"
          placeholder="@username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website" className="text-sm font-medium text-[#282828]">Website</Label>
        <Input
          id="website"
          value={creatorData.website}
          onChange={(e) => onUpdateField("website", e.target.value)}
          disabled={loading || !isEditing}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl text-[#282828]"
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  );
};

export default CreatorProfileForm;