import { useEffect, useState } from "react";
import CreatorCard from "./CreatorCard";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";
import { useQuery } from "@tanstack/react-query";

interface CreatorGridProps {
  selectedSpecialties: string[];
}

const CreatorGrid = ({ selectedSpecialties }: CreatorGridProps) => {
  const { data: creators, isLoading } = useQuery({
    queryKey: ['creators', selectedSpecialties],
    queryFn: async () => {
      let query = supabase
        .from('creators')
        .select(`
          id,
          bio,
          instagram,
          website,
          location,
          specialties,
          profiles (
            first_name,
            last_name
          )
        `);

      if (selectedSpecialties.length > 0) {
        query = query.contains('specialties', selectedSpecialties);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching creators:', error);
        throw error;
      }

      return data?.map(creator => ({
        ...creator,
        firstName: creator.profiles?.[0]?.first_name || '',
        lastName: creator.profiles?.[0]?.last_name || '',
        profile: {
          first_name: creator.profiles?.[0]?.first_name || '',
          last_name: creator.profiles?.[0]?.last_name || ''
        },
        paymentDetails: '', // Adding the required field with a default empty string
        creatorType: '', // Adding optional field
        profileImage: null // Adding optional field
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-64 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          No creators found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
};

export default CreatorGrid;