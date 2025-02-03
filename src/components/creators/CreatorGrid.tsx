import { useState, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CreatorGridItem from "./grid/CreatorGridItem";
import CreatorFilters from "./CreatorFilters";
import { useCreators } from "./hooks/useCreators";
import { Creator } from "@/types/creator";
import { LoadingSpinner } from "../ui/loading-spinner";

// Memoize the CreatorGridItem to prevent unnecessary re-renders
const MemoizedCreatorGridItem = memo(CreatorGridItem);

const CreatorGrid = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCreatorType, setSelectedCreatorType] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const { data: creators = [], isLoading } = useCreators();

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

  // Memoize the filtered creators to prevent unnecessary recalculations
  const filteredCreators = useMemo(() => {
    console.log('Recalculating filtered creators');
    return creators?.filter((creator) => {
      const matchesType = !selectedCreatorType || creator.creator_type === selectedCreatorType;
      const matchesSpecialties = selectedSpecialties.length === 0 || 
        selectedSpecialties.every(specialty => creator.specialties?.includes(specialty));
      const matchesLocation = selectedLocations.length === 0 || 
        selectedLocations.some(location => creator.location?.includes(location));

      return matchesType && matchesSpecialties && matchesLocation;
    });
  }, [creators, selectedCreatorType, selectedSpecialties, selectedLocations]);

  const handleViewProfile = (creator: Creator) => {
    console.log("Viewing profile for:", creator);
  };

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center min-h-[400px]"
      >
        <LoadingSpinner size="lg" />
      </motion.div>
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

      <AnimatePresence mode="wait">
        <motion.div
          key="creator-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3,
            staggerChildren: 0.1,
            delayChildren: 0.1
          }}
        >
          {filteredCreators?.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.05 
              }}
            >
              <MemoizedCreatorGridItem
                creator={creator}
                onViewProfile={handleViewProfile}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredCreators?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 py-8"
          >
            <p>No creators found matching your criteria.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatorGrid;