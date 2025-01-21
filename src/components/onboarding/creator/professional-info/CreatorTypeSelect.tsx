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
    <div className="space-y-2.5">
      <Label className="text-sm font-medium text-nino-text">Creator Type</Label>
      <Select
        value={creatorType}
        onValueChange={(value) => onUpdateField("creatorType", value)}
        required
      >
        <SelectTrigger className="h-12 bg-gray-50/50 border-0 focus:ring-1 focus:ring-black rounded-xl text-base">
          <SelectValue placeholder="Select your creator type" />
        </SelectTrigger>
        <SelectContent>
          {CREATOR_TYPES.map((type) => (
            <SelectItem 
              key={type} 
              value={type}
              className="text-base"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CreatorTypeSelect;