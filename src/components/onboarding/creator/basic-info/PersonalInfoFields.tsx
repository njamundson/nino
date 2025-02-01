import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationField from "./fields/LocationField";

interface PersonalInfoFieldsProps {
  displayName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
}

const PersonalInfoFields = ({
  displayName,
  bio,
  location,
  onUpdateField,
  required = false,
}: PersonalInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base flex items-center gap-1">
          Display Name
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          value={displayName}
          onChange={(e) => onUpdateField("display_name", e.target.value)}
          placeholder="Enter your display name"
          className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
          required={required}
        />
      </div>

      <LocationField
        location={location}
        onUpdateField={onUpdateField}
        required={required}
      />

      <div className="space-y-2">
        <Label className="text-base flex items-center gap-1">
          Bio
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
          value={bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          className="bg-nino-bg border-transparent focus:border-nino-primary resize-none h-32 text-base"
          required={required}
        />
      </div>
    </div>
  );
};

export default PersonalInfoFields;