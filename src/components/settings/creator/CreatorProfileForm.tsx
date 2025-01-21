import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label htmlFor="firstName" className="text-sm font-medium text-nino-text">First Name</Label>
          <Input
            id="firstName"
            value={creatorData.firstName}
            onChange={(e) => onUpdateField("firstName", e.target.value)}
            disabled={loading}
            className="h-12 bg-gray-50/50 border-0 focus:ring-1 focus:ring-black rounded-xl text-base"
            placeholder="Enter your first name"
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="lastName" className="text-sm font-medium text-nino-text">Last Name</Label>
          <Input
            id="lastName"
            value={creatorData.lastName}
            onChange={(e) => onUpdateField("lastName", e.target.value)}
            disabled={loading}
            className="h-12 bg-gray-50/50 border-0 focus:ring-1 focus:ring-black rounded-xl text-base"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <CreatorTypeSelect
        creatorType={creatorData.creatorType}
        onUpdateField={onUpdateField}
      />

      <div className="space-y-2.5">
        <Label htmlFor="bio" className="text-sm font-medium text-nino-text">Bio</Label>
        <Textarea
          id="bio"
          value={creatorData.bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          disabled={loading}
          placeholder="Tell your story..."
          className="bg-gray-50/50 border-0 focus:ring-1 focus:ring-black rounded-xl resize-none h-32 text-base"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="location" className="text-sm font-medium text-nino-text">Location</Label>
        <Input
          id="location"
          value={creatorData.location}
          onChange={(e) => onUpdateField("location", e.target.value)}
          disabled={loading}
          className="h-12 bg-gray-50/50 border-0 focus:ring-1 focus:ring-black rounded-xl text-base"
          placeholder="Where are you based?"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="instagram" className="text-sm font-medium text-nino-text">Instagram Username</Label>
        <Input
          id="instagram"
          value={creatorData.instagram}
          onChange={(e) => onUpdateField("instagram", e.target.value)}
          disabled={loading}
          className="h-12 bg-gray-50/50 border-0 focus:ring-1 focus:ring-black rounded-xl text-base"
          placeholder="@username"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="website" className="text-sm font-medium text-nino-text">Website</Label>
        <Input
          id="website"
          value={creatorData.website}
          onChange={(e) => onUpdateField("website", e.target.value)}
          disabled={loading}
          className="h-12 bg-gray-50/50 border-0 focus:ring-1 focus:ring-black rounded-xl text-base"
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  );
};

export default CreatorProfileForm;