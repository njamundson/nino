import { useMemo } from "react";

interface UseCreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
}

export const useCreatorFilters = ({
  selectedSpecialties,
  selectedCreatorType,
  selectedLocations,
}: UseCreatorFiltersProps) => {
  const filterConditions = useMemo(() => ({
    specialties: selectedSpecialties,
    creatorType: selectedCreatorType,
    locations: selectedLocations,
  }), [selectedSpecialties, selectedCreatorType, selectedLocations]);

  return { filterConditions };
};