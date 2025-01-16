import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
}

const PersonalInfoFields = ({
  firstName,
  lastName,
  bio,
  location,
  onUpdateField,
}: PersonalInfoFieldsProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-base">First Name *</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => onUpdateField("firstName", e.target.value)}
            placeholder="Enter your first name"
            className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-base">Last Name *</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => onUpdateField("lastName", e.target.value)}
            placeholder="Enter your last name"
            className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-base">Location *</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => onUpdateField("location", e.target.value)}
          placeholder="Enter your location"
          className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base">Bio *</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          className="bg-nino-bg border-transparent focus:border-nino-primary resize-none min-h-[120px] text-base"
          required
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;