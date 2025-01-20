import { useEffect } from 'react';
import { Briefcase, FilePlus, MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const BrandStatsCards = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: activeProjects } = useQuery({
    queryKey: ['active-projects'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!brand) return 0;

      const { count } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brand.id)
        .eq('status', 'open');

      return count || 0;
    }
  });

  const { data: newProposals } = useQuery({
    queryKey: ['new-proposals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!brand) return 0;

      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('opportunity_id', brand.id)
        .eq('status', 'pending');

      return count || 0;
    }
  });

  const { data: newMessages } = useQuery({
    queryKey: ['new-messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false)
        .is('deleted_at', null);

      return count || 0;
    }
  });

  // Set up real-time subscription for updates
  useEffect(() => {
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['active-projects'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['new-proposals'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['new-messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const cardClasses = "bg-white shadow-sm rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card 
        className={cardClasses}
        onClick={() => navigate('/brand/campaigns')}
      >
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

      <Card 
        className={cardClasses}
        onClick={() => navigate('/brand/campaigns')}
      >
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

      <Card 
        className={cardClasses}
        onClick={() => navigate('/brand/messages')}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-nino-primary" />
            </div>
            <div>
              <h3 className="text-lg text-nino-text font-medium mb-1">
                New Messages
              </h3>
              <p className="text-4xl font-semibold text-nino-text">
                {newMessages ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandStatsCards;