import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CREATOR_TYPES, CreatorType } from "@/types/creator";

export interface CreatorTypeSelectProps {
  creatorType: CreatorType;
  onUpdateField: (field: string, value: CreatorType) => void;
}

const CreatorTypeSelect = ({ creatorType, onUpdateField }: CreatorTypeSelectProps) => {
  return (
    <Select
      value={creatorType}
      onValueChange={(value: CreatorType) => onUpdateField("creator_type", value)}
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
            {type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CreatorTypeSelect;