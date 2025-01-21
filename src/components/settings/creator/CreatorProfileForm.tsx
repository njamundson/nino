import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SkillsSelection from "../../onboarding/creator/professional-info/SkillsSelection";
import CreatorTypeSelect from "../../onboarding/creator/professional-info/CreatorTypeSelect";

interface CreatorProfileFormProps {
  loading: boolean;
  creatorData: {
    firstName: string;
    lastName: string;
    bio: string;
    location: string;
    instagram: string;
    website: string;
    specialties: string[];
    creatorType: string;
  };
  onUpdateField: (field: string, value: any) => void;
}

const CreatorProfileForm = ({
  loading,
  creatorData,
  onUpdateField,
}: CreatorProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={creatorData.firstName}
            onChange={(e) => onUpdateField("firstName", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={creatorData.lastName}
            onChange={(e) => onUpdateField("lastName", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <CreatorTypeSelect
          creatorType={creatorData.creatorType}
          onUpdateField={onUpdateField}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={creatorData.bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          disabled={loading}
          placeholder="Tell us about yourself..."
          className="bg-white/50 resize-none h-32"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={creatorData.location}
          onChange={(e) => onUpdateField("location", e.target.value)}
          disabled={loading}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram Username</Label>
        <Input
          id="instagram"
          value={creatorData.instagram}
          onChange={(e) => onUpdateField("instagram", e.target.value)}
          disabled={loading}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={creatorData.website}
          onChange={(e) => onUpdateField("website", e.target.value)}
          disabled={loading}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <SkillsSelection
          skills={creatorData.specialties}
          onUpdateSkills={(skills) => onUpdateField("specialties", skills)}
        />
      </div>
    </div>
  );
};

export default CreatorProfileForm;