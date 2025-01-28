import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import CreatorGrid from "@/components/creators/CreatorGrid";
import CreatorFilters from "@/components/creators/CreatorFilters";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const ViewCreators = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCreatorType, setSelectedCreatorType] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: creators, isLoading, error } = useQuery({
    queryKey: ['creators', selectedSpecialties, selectedCreatorType, selectedLocations],
    queryFn: async () => {
      try {
        let query = supabase
          .from('creators')
          .select(`
            id,
            first_name,
            last_name,
            bio,
            location,
            instagram,
            website,
            specialties,
            creator_type,
            profile_image_url,
            profile:profiles (
              first_name,
              last_name
            )
          `)
          .eq('onboarding_completed', true);

        if (selectedSpecialties.length > 0) {
          query = query.contains('specialties', selectedSpecialties);
        }

        if (selectedCreatorType) {
          query = query.eq('creator_type', selectedCreatorType);
        }

        if (selectedLocations.length > 0) {
          query = query.in('location', selectedLocations);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching creators:', error);
          toast.error('Error loading creators');
          throw error;
        }

        return data || [];
      } catch (error) {
        console.error('Error in creator data fetch:', error);
        toast.error('Error loading creators');
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties((prev) => 
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleCreatorTypeChange = (type: string | null) => {
    setSelectedCreatorType(type);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocations([location]);
  };

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Browse Creators"
          description="Discover and connect with talented creators for your campaigns."
        />
        <div className="mt-8 text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Error loading creators. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <PageHeader
        title="Browse Creators"
        description="Discover and connect with talented creators for your campaigns."
      />
      <CreatorFilters 
        selectedSpecialties={selectedSpecialties}
        selectedCreatorType={selectedCreatorType}
        selectedLocations={selectedLocations}
        onSpecialtyChange={handleSpecialtyChange}
        onCreatorTypeChange={handleCreatorTypeChange}
        onLocationChange={handleLocationChange}
      />
      <CreatorGrid 
        creators={creators}
        isLoading={isLoading}
        selectedSpecialties={selectedSpecialties}
        selectedCreatorType={selectedCreatorType}
        selectedLocations={selectedLocations}
      />
    </motion.div>
  );
};

export default ViewCreators;