import { useMemo } from "react";
import CreatorCard from "./CreatorCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreatorData } from "@/types/creator";
import { motion } from "framer-motion";
import { useCreatorFilters } from "./hooks/useCreatorFilters";
import { useCreatorFetch } from "./hooks/useCreatorFetch";

interface CreatorGridProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
}

const CREATORS_PER_PAGE = 12;

const CreatorGrid = ({
  selectedSpecialties,
  selectedCreatorType,
  selectedLocations,
}: CreatorGridProps) => {
  const isMobile = useIsMobile();
  const { filterConditions } = useCreatorFilters({
    selectedSpecialties,
    selectedCreatorType,
    selectedLocations,
  });
  
  const { 
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error 
  } = useCreatorFetch({
    filterConditions,
    CREATORS_PER_PAGE
  });

  // Memoize the flattened creators array
  const allCreators = useMemo(() => {
    return data?.pages.flatMap(page => page.creators) || [];
  }, [data?.pages]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">
          Error loading creators. Please try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`grid grid-cols-1 ${
        isMobile ? 'gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6'
      }`}>
        {allCreators.map((creator: CreatorData, index: number) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: Math.min(index * 0.1, 0.3)
            }}
          >
            <CreatorCard 
              creator={creator}
              onInvite={() => {}} 
            />
          </motion.div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-nino-primary text-white rounded-lg hover:bg-nino-primary/90 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CreatorGrid;