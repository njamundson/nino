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
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    const names = fullName.split(' ');
    
    if (names.length >= 2) {
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      onUpdateField('firstName', firstName);
      onUpdateField('lastName', lastName);
    } else {
      onUpdateField('firstName', fullName);
      onUpdateField('lastName', '');
    }
  };

  return (
    <>
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