import { Briefcase, FilePlus } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const StatsCards = () => {
  const { data: activeProjects } = useQuery({
    queryKey: ['active-projects'],
    queryFn: async () => {
      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!creator) return 0;

      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creator.id)
        .eq('status', 'accepted');

      return count || 0;
    }
  });

  const { data: newProposals } = useQuery({
    queryKey: ['new-proposals'],
    queryFn: async () => {
      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!creator) return 0;

      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creator.id)
        .eq('status', 'pending');

      return count || 0;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

export default StatsCards;