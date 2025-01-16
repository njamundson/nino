import { Briefcase, Users } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const BrandStatsCards = () => {
  const { data: activeOpportunities } = useQuery({
    queryKey: ['active-opportunities'],
    queryFn: async () => {
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
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

  const { data: totalApplications } = useQuery({
    queryKey: ['total-applications'],
    queryFn: async () => {
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (!brand) return 0;

      const { count } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('opportunity_id', brand.id);

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
                Active Opportunities
              </h3>
              <p className="text-4xl font-semibold text-nino-text">
                {activeOpportunities ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-nino-primary" />
            </div>
            <div>
              <h3 className="text-lg text-nino-text font-medium mb-1">
                Total Applications
              </h3>
              <p className="text-4xl font-semibold text-nino-text">
                {totalApplications ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandStatsCards;