import { Briefcase, FileText, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import StatsCard from '@/components/dashboard/brand/stats/StatsCard';
import { useIsMobile } from "@/hooks/use-mobile";

const StatsCards = () => {
  const isMobile = useIsMobile();

  const { data: activeProjects } = useQuery({
    queryKey: ['active-projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!creator) return 0;

      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creator.id)
        .eq('status', 'pending');

      return count || 0;
    }
  });

  const { data: completedProjects } = useQuery({
    queryKey: ['completed-projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!creator) return 0;

      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creator.id)
        .eq('status', 'completed');

      return count || 0;
    }
  });

  return (
    <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-6'} mb-6`}>
      <StatsCard
        icon={Briefcase}
        title="Active Projects"
        value={activeProjects ?? 0}
      />

      <StatsCard
        icon={FileText}
        title="New Proposals"
        value={newProposals ?? 0}
      />

      <StatsCard
        icon={CheckCircle}
        title="Completed Projects"
        value={completedProjects ?? 0}
      />
    </div>
  );
};

export default StatsCards;
