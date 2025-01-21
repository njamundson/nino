import { Briefcase, FileText, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const StatsCards = () => {
  const navigate = useNavigate();

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="p-6">
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
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-3xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-nino-primary" />
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
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-3xl overflow-hidden cursor-pointer" onClick={() => navigate('/creator/messages')}>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-nino-primary" />
            </div>
            <div>
              <h3 className="text-lg text-nino-text font-medium mb-1">
                Completed Projects
              </h3>
              <p className="text-4xl font-semibold text-nino-text">
                {completedProjects ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;