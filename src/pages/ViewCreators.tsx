import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreatorGrid from "@/components/creators/CreatorGrid";

const ViewCreators = () => {
  const { data: creators, isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creators')
        .select(`
          id,
          bio,
          profile:profiles(
            first_name,
            last_name
          )
        `)
        .eq('is_verified', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Browse Creators"
        description="Discover and connect with talented creators for your campaigns."
      />
      <CreatorGrid creators={creators} isLoading={isLoading} />
    </div>
  );
};

export default ViewCreators;