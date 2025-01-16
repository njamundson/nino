import BrandDashboard from "@/components/dashboard/BrandDashboard";
import CreatorDashboard from "@/components/dashboard/CreatorDashboard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { data: userType } = useQuery({
    queryKey: ['user-type'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brand) return 'brand';

      return null;
    }
  });

  if (userType === 'brand') {
    return <BrandDashboard />;
  }

  return <CreatorDashboard />;
};

export default Dashboard;