import { useState } from "react";
import { motion } from "framer-motion";
import CreatorGridItem from "./grid/CreatorGridItem";
import CreatorFilters from "./CreatorFilters";
import { useCreators } from "./hooks/useCreators";
import { Creator } from "@/types/creator";
import { LoadingSpinner } from "../ui/loading-spinner";

const CreatorGrid = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCreatorType, setSelectedCreatorType] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const { data: creators, isLoading, error } = useCreators();

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleCreatorTypeChange = (type: string | null) => {
    setSelectedCreatorType(type);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [location]
    );
  };

  const filteredCreators = creators?.filter((creator) => {
    const matchesType = !selectedCreatorType || creator.creator_type === selectedCreatorType;
    const matchesSpecialties = selectedSpecialties.length === 0 || 
      selectedSpecialties.every(specialty => creator.specialties?.includes(specialty));
    const matchesLocation = selectedLocations.length === 0 || 
      selectedLocations.some(location => creator.location?.includes(location));

    return matchesType && matchesSpecialties && matchesLocation;
  });

  const handleViewProfile = (creator: Creator) => {
    console.log("Viewing profile for:", creator);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Error loading creators. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatorFilters
        selectedSpecialties={selectedSpecialties}
        selectedCreatorType={selectedCreatorType}
        selectedLocations={selectedLocations}
        onSpecialtyChange={handleSpecialtyChange}
        onCreatorTypeChange={handleCreatorTypeChange}
        onLocationChange={handleLocationChange}
      />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredCreators?.map((creator) => (
          <CreatorGridItem
            key={creator.id}
            creator={creator}
            onViewProfile={handleViewProfile}
          />
        ))}
      </motion.div>

      {filteredCreators?.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No creators found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CreatorGrid;