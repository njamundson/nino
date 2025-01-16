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
}

const CreatorTypeSelect = ({ creatorType, onUpdateField }: CreatorTypeSelectProps) => {
  const creatorTypes = [
    "Solo Travel Creator",
    "Couple Travel Creator",
    "Family Travel Creator",
    "Luxury Travel Specialist",
    "Adventure Travel Creator",
    "Cultural Travel Expert"
  ];

  return (
    <div className="space-y-2">
      <Label className="text-base">Creator Type</Label>
      <Select
        value={creatorType}
        onValueChange={(value) => onUpdateField("creatorType", value)}
      >
        <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base">
          <SelectValue placeholder="Select your travel creator type" />
        </SelectTrigger>
        <SelectContent>
          {creatorTypes.map((type) => (
            <SelectItem key={type} value={type.toLowerCase()}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CreatorTypeSelect;