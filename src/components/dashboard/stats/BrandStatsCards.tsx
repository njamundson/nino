import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Calendar, FilePlus } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const BrandStatsCards = () => {
  const { data: brandId } = useQuery({
    queryKey: ['brand-id'],
    queryFn: async () => {
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();
      return brand?.id;
    },
  });

  const { data: activeProjects, isLoading: isLoadingActive } = useQuery({
    queryKey: ['active-projects', brandId],
    enabled: !!brandId,
    queryFn: async () => {
      const { count } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId)
        .eq('status', 'open');
      return count || 0;
    },
  });

  const { data: upcomingShoots, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcoming-shoots', brandId],
    enabled: !!brandId,
    queryFn: async () => {
      const { count } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId)
        .eq('status', 'open')
        .gte('start_date', new Date().toISOString().split('T')[0]);
      return count || 0;
    },
  });

  const { data: newProposals, isLoading: isLoadingProposals } = useQuery({
    queryKey: ['new-proposals', brandId],
    enabled: !!brandId,
    queryFn: async () => {
      const { count } = await supabase
        .from('applications')
        .select('opportunities!inner(*)', { count: 'exact', head: true })
        .eq('opportunities.brand_id', brandId)
        .eq('status', 'pending');
      return count || 0;
    },
  });

  const isLoading = isLoadingActive || isLoadingUpcoming || isLoadingProposals;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-white shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-nino-primary" />
            </div>
            <div>
              <h3 className="text-lg text-nino-text font-medium mb-1">
                Active Projects
              </h3>
              <p className="text-4xl font-semibold text-nino-text">
                {activeProjects ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-nino-primary" />
            </div>
            <div>
              <h3 className="text-lg text-nino-text font-medium mb-1">
                Upcoming Shoots
              </h3>
              <p className="text-4xl font-semibold text-nino-text">
                {upcomingShoots ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <FilePlus className="w-6 h-6 text-nino-primary" />
            </div>
            <div>
              <h3 className="text-lg text-nino-text font-medium mb-1">
                New Proposals
              </h3>
              <p className="text-4xl font-semibold text-nino-text">
                {newProposals ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandStatsCards;