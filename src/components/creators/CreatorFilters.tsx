import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CREATOR_TYPES, CREATOR_SPECIALTIES } from "@/types/creator";

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  onSpecialtyChange: (specialty: string) => void;
  onCreatorTypeChange: (type: string | null) => void;
}

const CreatorFilters = ({ 
  selectedSpecialties, 
  selectedCreatorType,
  onSpecialtyChange,
  onCreatorTypeChange 
}: CreatorFiltersProps) => {
  return (
    <div className="space-y-8 bg-[#F1F0FB] p-6 rounded-2xl">
      <div>
        <h3 className="text-[#222222] font-medium mb-4">Creator Type</h3>
        <Select
          value={selectedCreatorType || "all"}
          onValueChange={(value) => onCreatorTypeChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-[280px] bg-white border-0 shadow-sm h-12 text-[#333333] hover:bg-white/90 transition-colors">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white border-0 shadow-lg">
            <SelectItem value="all" className="text-[#333333] hover:bg-[#F1F1F1] cursor-pointer">
              All Types
            </SelectItem>
            {CREATOR_TYPES.map((type) => (
              <SelectItem 
                key={type} 
                value={type}
                className="text-[#333333] hover:bg-[#F1F1F1] cursor-pointer"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-[#222222] font-medium mb-4">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {CREATOR_SPECIALTIES.map((specialty) => (
            <Badge
              key={specialty}
              variant="outline"
              className={cn(
                "px-4 py-2 text-sm cursor-pointer transition-all duration-200 rounded-full border-0",
                selectedSpecialties.includes(specialty)
                  ? "bg-[#1EAEDB] text-white hover:bg-[#0FA0CE] shadow-sm"
                  : "bg-white text-[#333333] hover:bg-[#F1F1F1] shadow-sm"
              )}
              onClick={() => onSpecialtyChange(specialty)}
            >
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorFilters;