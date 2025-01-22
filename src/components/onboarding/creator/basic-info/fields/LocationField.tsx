import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES, STATES_BY_COUNTRY, CITIES_BY_COUNTRY, COUNTRIES_WITH_CITIES } from "../locations";

interface LocationFieldProps {
  location: string;
  onUpdateField: (field: string, value: string) => void;
}

const LocationField = ({ location, onUpdateField }: LocationFieldProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  useEffect(() => {
    if (location && !selectedCountry) {
      const [region, country] = location.split(", ").reverse();
      if (country && COUNTRIES.includes(country)) {
        setSelectedCountry(country);
        if (region) {
          setSelectedRegion(region);
        }
      }
    }
  }, [location]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedRegion("");
    onUpdateField("location", value);
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    onUpdateField("location", `${value}, ${selectedCountry}`);
  };

  const getRegionLabel = () => {
    return COUNTRIES_WITH_CITIES.includes(selectedCountry) ? "City" : "State/Province";
  };

  const getRegionOptions = () => {
    if (COUNTRIES_WITH_CITIES.includes(selectedCountry)) {
      return CITIES_BY_COUNTRY[selectedCountry] || [];
    }
    return STATES_BY_COUNTRY[selectedCountry] || [];
  };

  return (
    <div className="space-y-4">
      <Label className="text-base flex items-center gap-1">
        Location
        <span className="text-red-500">*</span>
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Select onValueChange={handleCountryChange} value={selectedCountry} required>
            <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary h-12">
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
        </div>

        {selectedCountry && (
          <div className="space-y-2">
            <Select onValueChange={handleRegionChange} value={selectedRegion} required>
              <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary h-12">
                <SelectValue placeholder={`Select ${getRegionLabel()}`} />
              </SelectTrigger>
              <SelectContent>
                {getRegionOptions().map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationField;