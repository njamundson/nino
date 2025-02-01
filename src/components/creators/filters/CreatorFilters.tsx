import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreatorFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  creatorTypes: string[];
}

const CreatorFilters = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  creatorTypes,
}: CreatorFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <Input
        placeholder="Search creators..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="md:w-64"
      />
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="md:w-48">
          <SelectValue placeholder="Creator type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {creatorTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CreatorFilters;