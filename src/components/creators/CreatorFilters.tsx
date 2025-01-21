import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  onLocationChange,
}: CreatorFiltersProps) => {
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  const displayedSpecialties = showAllSpecialties
    ? CREATOR_SPECIALTIES
    : CREATOR_SPECIALTIES.slice(0, 6);

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <div>
        <h3 className="text-sm font-medium mb-3">Creator Type</h3>
        <Select
          value={selectedCreatorType || "all"}
          onValueChange={(value) => onCreatorTypeChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select creator type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CREATOR_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Location</h3>
        <Select
          value={selectedLocation || "all"}
          onValueChange={(value) => onLocationChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-full md:w-[300px]">
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
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
          {displayedSpecialties.map((specialty) => (
            <Badge
              key={specialty}
              variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onSpecialtyChange(specialty)}
            >
              {specialty}
            </Badge>
          ))}
          {CREATOR_SPECIALTIES.length > 6 && (
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => setShowAllSpecialties(!showAllSpecialties)}
            >
              {showAllSpecialties ? "Show Less" : "Show More"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorFilters;