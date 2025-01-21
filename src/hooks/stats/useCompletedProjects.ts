import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCompletedProjects = () => {
  const { data: completedProjects } = useQuery({
    queryKey: ['completed-projects'],
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
        .eq('status', 'completed');

      return count || 0;
    }
  });

  return completedProjects ?? 0;
};