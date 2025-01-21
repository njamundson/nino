import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatorData, CreatorType } from '@/types/creator';
import CreatorCard from './CreatorCard';
import { LoadingSpinner } from '../ui/loading-spinner';

interface CreatorGridProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
  onInvite: (creatorId: string) => void;
}

const CreatorGrid = ({
  selectedSpecialties,
  selectedCreatorType,
  selectedLocations,
  onInvite
}: CreatorGridProps) => {
  const { data: creators, isLoading } = useQuery({
    queryKey: ['creators', selectedSpecialties, selectedCreatorType, selectedLocations],
    queryFn: async () => {
      let query = supabase
        .from('creators')
        .select(`
          *,
          profile:profiles!creators_user_id_fkey (
            first_name,
            last_name
          )
        `);

      if (selectedSpecialties.length > 0) {
        query = query.contains('specialties', selectedSpecialties);
      }

      if (selectedCreatorType) {
        query = query.eq('creator_type', selectedCreatorType);
      }

      if (selectedLocations.length > 0) {
        query = query.ilike('location', `%${selectedLocations[0]}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((creator): CreatorData => ({
        id: creator.id,
        user_id: creator.user_id,
        bio: creator.bio || '',
        location: creator.location || '',
        specialties: creator.specialties || [],
        instagram: creator.instagram || '',
        website: creator.website || '',
        profile_image_url: creator.profile_image_url || '',
        creator_type: creator.creator_type as CreatorType || 'solo',
        profile: {
          first_name: creator.profile?.first_name || '',
          last_name: creator.profile?.last_name || ''
        },
        created_at: creator.created_at,
        updated_at: creator.updated_at
      }));
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">No creators found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard 
          key={creator.id} 
          creator={creator}
          onInvite={onInvite}
        />
      ))}
    </div>
  );
};

export default CreatorGrid;