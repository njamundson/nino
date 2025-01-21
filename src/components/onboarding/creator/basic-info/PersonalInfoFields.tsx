import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { 
  COUNTRIES, 
  STATES_BY_COUNTRY, 
  CITIES_BY_COUNTRY, 
  COUNTRIES_WITH_CITIES 
} from "./locations";

interface PersonalInfoFieldsProps {
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  onUpdateField: (field: string, value: string) => void;
  required?: boolean;
}

const PersonalInfoFields = ({
  firstName,
  lastName,
  bio,
  location,
  onUpdateField,
  required = false,
}: PersonalInfoFieldsProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    const names = fullName.trim().split(/\s+/);
    
    if (names.length >= 2) {
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      onUpdateField('firstName', firstName);
      onUpdateField('lastName', lastName);
    } else {
      onUpdateField('firstName', fullName);
      onUpdateField('lastName', '');
    }
  };

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
    <>
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-base flex items-center gap-1">
          Full Name or Creator Name
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="fullName"
          value={`${firstName}${lastName ? ' ' + lastName : ''}`}
          onChange={handleFullNameChange}
          placeholder="Enter your full name"
          className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
          required={required}
        />
      </div>

      <div className="space-y-4">
        <Label className="text-base flex items-center gap-1">
          Location
          {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Select onValueChange={handleCountryChange} value={selectedCountry} required={required}>
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
              <Select onValueChange={handleRegionChange} value={selectedRegion} required={required}>
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

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-base flex items-center gap-1">
          Bio
          {required && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => onUpdateField("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          className="bg-nino-bg border-transparent focus:border-nino-primary resize-none min-h-[120px] text-base"
          required={required}
        />
      </div>
    </>
  );
};

export default PersonalInfoFields;