import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationFieldProps {
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
}

const LocationField = ({ location, onUpdateField, required = false }: LocationFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-base flex items-center gap-1">
        Location
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        value={location}
        onChange={(e) => onUpdateField("location", e.target.value)}
        placeholder="Enter your location"
        className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
        required={required}
      />
    </div>
  );
};

export default LocationField;