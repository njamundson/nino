import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationField from "./LocationField";

interface PersonalInfoFieldsProps {
  display_name: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
}

const PersonalInfoFields = ({
  display_name,
  bio,
  location,
  onUpdateField,
  required = false,
}: PersonalInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display_name" className="text-base">
          Display Name
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id="display_name"
          value={display_name}
          onChange={(e) => onUpdateField("display_name", e.target.value)}
          className="bg-white/50"
          required={required}
        />
      </div>

      <LocationField
        location={location}
        onUpdateField={onUpdateField}
        required={required}
      />

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base">
          Bio
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          className="bg-white/50 resize-none h-32"
          required={required}
        />
      </div>
    </div>
  );
};

export default PersonalInfoFields;