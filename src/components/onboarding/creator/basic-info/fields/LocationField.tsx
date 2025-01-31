import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LocationFieldProps {
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
}

const LocationField = ({
  location,
  onUpdateField,
  required = false,
}: LocationFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="location" className="text-base">
        Location
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id="location"
        value={location}
        onChange={(e) => onUpdateField("location", e.target.value)}
        className="bg-white/50"
        required={required}
      />
    </div>
  );
};

export default LocationField;