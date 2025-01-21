import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BioFieldProps {
  bio: string;
  onUpdateField: (field: string, value: string) => void;
}

const BioField = ({ bio, onUpdateField }: BioFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="bio" className="text-base flex items-center gap-1">
        Bio
        <span className="text-red-500">*</span>
      </Label>
      <Textarea
        id="bio"
        value={bio}
        onChange={(e) => onUpdateField("bio", e.target.value)}
        placeholder="Tell us about yourself..."
        className="bg-nino-bg border-transparent focus:border-nino-primary resize-none min-h-[120px] text-base"
        required
      />
    </div>
  );
};

export default BioField;