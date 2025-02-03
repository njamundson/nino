import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES, STATES_BY_COUNTRY, CITIES_BY_COUNTRY, COUNTRIES_WITH_CITIES } from "../locations";

interface LocationFieldProps {
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const LocationField = ({ location, onUpdateField, required = false, disabled = false }: LocationFieldProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);

  useEffect(() => {
    // Parse existing location if it exists
    if (location) {
      const [country, region] = location.split(", ");
      setSelectedCountry(country || "");
      setSelectedRegion(region || "");

      // Update available regions based on country
      if (country) {
        if (STATES_BY_COUNTRY[country]) {
          setAvailableRegions(STATES_BY_COUNTRY[country]);
        } else if (COUNTRIES_WITH_CITIES.includes(country)) {
          setAvailableRegions(CITIES_BY_COUNTRY[country] || []);
        }
      }
    }
  }, [location]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedRegion("");
    
    // Update available regions
    if (STATES_BY_COUNTRY[value]) {
      setAvailableRegions(STATES_BY_COUNTRY[value]);
    } else if (COUNTRIES_WITH_CITIES.includes(value)) {
      setAvailableRegions(CITIES_BY_COUNTRY[value] || []);
    } else {
      setAvailableRegions([]);
    }
    
    onUpdateField("location", value);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    onUpdateField("location", `${selectedCountry}, ${value}`);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base flex items-center gap-1">
          Country
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={selectedCountry}
          onValueChange={handleCountryChange}
          disabled={disabled}
        >
          <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base">
            <SelectValue placeholder="Select your country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCountry && availableRegions.length > 0 && (
        <div className="space-y-2">
          <Label className="text-base flex items-center gap-1">
            {STATES_BY_COUNTRY[selectedCountry] ? "State" : "City"}
            {required && <span className="text-red-500">*</span>}
          </Label>
          <Select
            value={selectedRegion}
            onValueChange={handleRegionChange}
            disabled={disabled}
          >
            <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base">
              <SelectValue placeholder={`Select your ${STATES_BY_COUNTRY[selectedCountry] ? "state" : "city"}`} />
            </SelectTrigger>
            <SelectContent>
              {availableRegions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default LocationField;