import { useState } from "react";
import { motion } from "framer-motion";
import CreatorGridItem from "./grid/CreatorGridItem";
import CreatorFilters from "./filters/CreatorFilters";
import { useCreators } from "./hooks/useCreators";
import { Creator } from "@/types/creator";
import { LoadingSpinner } from "../ui/loading-spinner";

const CreatorGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const { data: creators, isLoading, error } = useCreators();

  const filteredCreators = creators?.filter((creator) => {
    const matchesSearch = creator.profile.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === "all" || creator.creator_type === selectedType;

    return matchesSearch && matchesType;
  });

  const creatorTypes = creators
    ? Array.from(new Set(creators.map((creator) => creator.creator_type)))
        .filter(Boolean)
        .sort()
    : [];

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
    <div>
      <CreatorFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        creatorTypes={creatorTypes}
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