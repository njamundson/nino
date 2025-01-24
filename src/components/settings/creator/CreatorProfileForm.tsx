import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationField from "../../onboarding/creator/basic-info/fields/LocationField";
import SkillsSelection from "../../onboarding/creator/professional-info/SkillsSelection";

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
          <Label htmlFor="firstName" className="text-sm font-medium text-[#282828]">First Name</Label>
          <Input
            id="firstName"
            value={creatorData.firstName}
            onChange={(e) => onUpdateField("firstName", e.target.value)}
            disabled={loading}
            className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl text-[#282828]"
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-[#282828]">Last Name</Label>
          <Input
            id="lastName"
            value={creatorData.lastName}
            onChange={(e) => onUpdateField("lastName", e.target.value)}
            disabled={loading}
            className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl text-[#282828]"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-sm font-medium text-[#282828]">Bio</Label>
        <Textarea
          id="bio"
          value={creatorData.bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          disabled={loading}
          placeholder="Tell your story..."
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl resize-none h-32 text-[#282828]"
        />
      </div>

      <LocationField
        location={creatorData.location}
        onUpdateField={onUpdateField}
      />

      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#282828]">Skills & Expertise</Label>
        <SkillsSelection
          skills={creatorData.specialties}
          onUpdateSkills={(skills) => onUpdateField("specialties", skills)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram" className="text-sm font-medium text-[#282828]">Instagram Username</Label>
        <Input
          id="instagram"
          value={creatorData.instagram}
          onChange={(e) => onUpdateField("instagram", e.target.value)}
          disabled={loading}
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
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl text-[#282828]"
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  );
};

export default CreatorProfileForm;