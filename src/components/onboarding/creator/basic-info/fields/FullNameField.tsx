import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FullNameFieldProps {
  displayName: string;
  onUpdateField: (field: string, value: string) => void;
}

const FullNameField = ({ displayName, onUpdateField }: FullNameFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="displayName" className="text-base flex items-center gap-1">
        Display Name
        <span className="text-red-500">*</span>
      </Label>
      <Input
        id="displayName"
        value={displayName}
        onChange={(e) => onUpdateField('display_name', e.target.value)}
        placeholder="Enter your display name"
        className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
        required
      />
    </div>
  );
};

export default FullNameField;