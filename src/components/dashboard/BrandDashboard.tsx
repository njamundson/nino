import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StatsCards from "./stats/StatsCards";
import RecentMessages from "./messages/RecentMessages";
import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import PageHeader from "../shared/PageHeader";

const BrandDashboard = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return data;
    }
  });

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      <PageHeader 
        title={`Welcome back, ${profile?.first_name || 'there'}!`}
        description="Here's what's happening with your brand today."
      />

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages />
        <QuickNotes />
      </div>
    </div>
  );
};

export default BrandDashboard;