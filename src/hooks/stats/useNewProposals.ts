import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNewProposals = () => {
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
        .eq('status', 'pending')
        .eq('opportunity.brand_id', brand.id);

      return count || 0;
    }
  });

  return newProposals ?? 0;
};