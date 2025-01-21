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

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedRegion("");
    if (selectedLocations.length > 0) {
      onLocationChange(selectedLocations[0]); // Remove previous location
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

      <div>
        <h3 className="text-sm font-medium mb-3">Location</h3>
        <div className="space-y-2 max-w-md">
          <Select
            value={selectedCountry}
            onValueChange={handleCountryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
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
              <SelectTrigger>
                <SelectValue placeholder={`Select ${getRegionLabel(selectedCountry)}`} />
              </SelectTrigger>
              <SelectContent>
                {getRegionOptions(selectedCountry).map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorFilters;