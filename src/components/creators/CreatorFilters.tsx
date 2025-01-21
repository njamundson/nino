import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CREATOR_TYPES, CREATOR_SPECIALTIES } from "@/types/creator";
import { northAmericanCountries } from "@/components/onboarding/creator/basic-info/locations/northAmerica";
import { southAmericanCountries } from "@/components/onboarding/creator/basic-info/locations/southAmerica";
import { europeanCountries } from "@/components/onboarding/creator/basic-info/locations/europe";
import { caribbeanCountries } from "@/components/onboarding/creator/basic-info/locations/caribbean";

const LOCATIONS = [
  ...northAmericanCountries,
  ...southAmericanCountries,
  ...europeanCountries,
  ...caribbeanCountries
].sort();

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
  onSpecialtyChange: (specialty: string) => void;
  onCreatorTypeChange: (type: string | null) => void;
  onLocationChange: (location: string) => void;
}

const CreatorFilters = ({ 
  selectedSpecialties, 
  selectedCreatorType,
  selectedLocations,
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
        <h3 className="text-sm font-medium mb-3">Locations</h3>
        <div className="flex flex-wrap gap-2">
          {LOCATIONS.map((location) => (
            <Badge
              key={location}
              variant="outline"
              className={cn(
                "px-4 py-2 text-base cursor-pointer transition-all duration-200 border-2",
                selectedLocations.includes(location)
                  ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary"
                  : "bg-transparent text-nino-primary hover:bg-nino-primary/10 border-nino-primary"
              )}
              onClick={() => onLocationChange(location)}
            >
              {location}
            </Badge>
          ))}
        </div>
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