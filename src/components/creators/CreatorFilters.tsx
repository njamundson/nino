import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CREATOR_TYPES, CREATOR_SPECIALTIES } from "@/types/creator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LOCATIONS } from "@/components/onboarding/creator/basic-info/locations";

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocation: string | null;
  onSpecialtyChange: (specialty: string) => void;
  onCreatorTypeChange: (type: string | null) => void;
  onLocationChange: (location: string | null) => void;
}

const CreatorFilters = ({ 
  selectedSpecialties, 
  selectedCreatorType,
  selectedLocation,
  onSpecialtyChange,
  onCreatorTypeChange,
  onLocationChange
}: CreatorFiltersProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Creator Type</h3>
        <div className="flex flex-wrap gap-2">
          <Badge
            key="all"
            variant="outline"
            className={cn(
              "px-4 py-2 text-base cursor-pointer transition-all duration-200 border-2",
              !selectedCreatorType
                ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary"
                : "bg-transparent text-nino-primary hover:bg-nino-primary/10 border-nino-primary"
            )}
            onClick={() => onCreatorTypeChange(null)}
          >
            All Types
          </Badge>
          {CREATOR_TYPES.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className={cn(
                "px-4 py-2 text-base cursor-pointer transition-all duration-200 border-2",
                selectedCreatorType === type
                  ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary"
                  : "bg-transparent text-nino-primary hover:bg-nino-primary/10 border-nino-primary"
              )}
              onClick={() => onCreatorTypeChange(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Location</h3>
        <Select
          value={selectedLocation || ""}
          onValueChange={(value) => onLocationChange(value || null)}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {LOCATIONS.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {CREATOR_SPECIALTIES.map((specialty) => (
            <Badge
              key={specialty}
              variant="outline"
              className={cn(
                "px-4 py-2 text-base cursor-pointer transition-all duration-200 border-2",
                selectedSpecialties.includes(specialty)
                  ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary"
                  : "bg-transparent text-nino-primary hover:bg-nino-primary/10 border-nino-primary"
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