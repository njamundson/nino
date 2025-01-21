import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CREATOR_TYPES } from "@/types/creator";

interface CreatorTypeSelectProps {
  creatorType: string;
  onUpdateField: (field: string, value: string) => void;
}

const CreatorTypeSelect = ({ creatorType, onUpdateField }: CreatorTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-base">Creator Type *</Label>
      <Select
        value={creatorType}
        onValueChange={(value) => onUpdateField("creatorType", value)}
        required
      >
        <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base">
          <SelectValue placeholder="Select your creator type" />
        </SelectTrigger>
        <SelectContent>
          {CREATOR_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CreatorTypeSelect;