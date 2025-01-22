import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CREATOR_TYPES, CREATOR_SPECIALTIES } from "@/types/creator";
import { northAmericanCountries, statesByCountry as northAmericanStates } from "@/components/onboarding/creator/basic-info/locations/northAmerica";
import { southAmericanCountries, statesByCountry as southAmericanStates } from "@/components/onboarding/creator/basic-info/locations/southAmerica";
import { europeanCountries, statesByCountry as europeanStates, citiesByCountry } from "@/components/onboarding/creator/basic-info/locations/europe";
import { caribbeanCountries } from "@/components/onboarding/creator/basic-info/locations/caribbean";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Filter } from "lucide-react";
import { useState } from "react";

const COUNTRIES = [
  ...northAmericanCountries,
  ...southAmericanCountries,
  ...europeanCountries,
  ...caribbeanCountries
].sort();

const STATES_BY_COUNTRY = {
  ...northAmericanStates,
  ...southAmericanStates,
  ...europeanStates
};

const CITIES_BY_COUNTRY = citiesByCountry;
const COUNTRIES_WITH_CITIES = Object.keys(CITIES_BY_COUNTRY);

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
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedRegion("");
    if (selectedLocations.length > 0) {
      onLocationChange(selectedLocations[0]);
    }
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    onLocationChange(`${value}, ${selectedCountry}`);
  };

  const getRegionLabel = (country: string) => {
    return COUNTRIES_WITH_CITIES.includes(country) ? "City" : "State/Province";
  };

  const getRegionOptions = (country: string) => {
    if (COUNTRIES_WITH_CITIES.includes(country)) {
      return CITIES_BY_COUNTRY[country] || [];
    }
    return STATES_BY_COUNTRY[country] || [];
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-white/50 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100"
    >
      <CollapsibleTrigger className="flex items-center justify-end w-full p-6">
        <Filter className="h-5 w-5 text-gray-500" />
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-8 px-6 pb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Creator Type</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              key="all"
              variant="outline"
              className={cn(
                "px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 rounded-xl border",
                !selectedCreatorType
                  ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary shadow-sm"
                  : "bg-white/80 text-nino-primary hover:bg-nino-primary/5 border-nino-primary/20"
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
                  "px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 rounded-xl border",
                  selectedCreatorType === type
                    ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary shadow-sm"
                    : "bg-white/80 text-nino-primary hover:bg-nino-primary/5 border-nino-primary/20"
                )}
                onClick={() => onCreatorTypeChange(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Specialties</h3>
          <div className="flex flex-wrap gap-2">
            {CREATOR_SPECIALTIES.map((specialty) => (
              <Badge
                key={specialty}
                variant="outline"
                className={cn(
                  "px-4 py-2 text-sm font-medium cursor-pointer transition-all duration-200 rounded-xl border",
                  selectedSpecialties.includes(specialty)
                    ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary shadow-sm"
                    : "bg-white/80 text-nino-primary hover:bg-nino-primary/5 border-nino-primary/20"
                )}
                onClick={() => onSpecialtyChange(specialty)}
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Location</h3>
          <div className="space-y-3 max-w-md">
            <Select
              value={selectedCountry}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="w-full bg-white/80 border-gray-200 rounded-xl h-11 px-4 hover:bg-white transition-colors">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent className="bg-white/80 backdrop-blur-xl border-gray-200">
                {COUNTRIES.map((country) => (
                  <SelectItem 
                    key={country} 
                    value={country}
                    className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                  >
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCountry && (
              <Select
                value={selectedRegion}
                onValueChange={handleRegionChange}
              >
                <SelectTrigger className="w-full bg-white/80 border-gray-200 rounded-xl h-11 px-4 hover:bg-white transition-colors">
                  <SelectValue placeholder={`Select ${getRegionLabel(selectedCountry)}`} />
                </SelectTrigger>
                <SelectContent className="bg-white/80 backdrop-blur-xl border-gray-200">
                  {getRegionOptions(selectedCountry).map((region) => (
                    <SelectItem 
                      key={region} 
                      value={region}
                      className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                    >
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CreatorFilters;
