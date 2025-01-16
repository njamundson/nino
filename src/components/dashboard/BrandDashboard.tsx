import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrandStatsCards from "./stats/BrandStatsCards";
import RecentMessages from "./messages/RecentMessages";
import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";

const BrandDashboard = () => {
  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    }
  });

  const { data: brand } = useQuery({
    queryKey: ['brand'],
    enabled: !!profile?.id,
    queryFn: async () => {
      if (!profile?.id) return null;

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  if (profileError) {
    console.error("Error loading profile:", profileError);
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading dashboard. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <BrandStatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages />
        <QuickNotes />
      </div>
    </div>
  );
};

export default BrandDashboard;