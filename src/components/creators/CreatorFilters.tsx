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
    <div className="space-y-8">
      <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-base font-medium mb-4 text-nino-text">Creator Type</h3>
        <Select
          value={selectedCreatorType || "all"}
          onValueChange={(value) => onCreatorTypeChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[240px] bg-white/70 border-gray-200/50 hover:bg-white/90 transition-all duration-200 rounded-xl h-12">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50 rounded-xl shadow-lg">
            <SelectItem value="all" className="focus:bg-gray-100/50">All Types</SelectItem>
            {CREATOR_TYPES.map((type) => (
              <SelectItem 
                key={type} 
                value={type}
                className="focus:bg-gray-100/50"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <h3 className="text-base font-medium mb-4 text-nino-text">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {CREATOR_SPECIALTIES.map((specialty) => (
            <Badge
              key={specialty}
              variant="outline"
              className={cn(
                "px-4 py-2 text-sm cursor-pointer transition-all duration-200 rounded-xl border",
                selectedSpecialties.includes(specialty)
                  ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary shadow-sm"
                  : "bg-white/70 hover:bg-white text-nino-text hover:text-nino-primary border-gray-200/50 hover:border-nino-primary/20"
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