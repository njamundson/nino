import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CreatorTypeSelectProps {
  creatorType: string;
  onUpdateField: (field: string, value: string) => void;
  error?: string;
}

const CreatorTypeSelect = ({ creatorType, onUpdateField, error }: CreatorTypeSelectProps) => {
  const creatorTypes = ["Solo", "Couple", "Family", "Group"];

  return (
    <div className="space-y-2">
      <Label className="text-base">Creator Type *</Label>
      <Select
        value={creatorType}
        onValueChange={(value) => onUpdateField("creatorType", value)}
      >
        <SelectTrigger className={`bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base ${
          error ? "border-red-500" : ""
        }`}>
          <SelectValue placeholder="Select your creator type" />
        </SelectTrigger>
        <SelectContent>
          {creatorTypes.map((type) => (
            <SelectItem key={type} value={type.toLowerCase()}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default CreatorTypeSelect;