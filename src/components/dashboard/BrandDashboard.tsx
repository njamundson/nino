import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StatsCards from "./stats/BrandStatsCards";
import RecentMessages from "./messages/RecentMessages";
import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import PageHeader from "../shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

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

  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ['brand'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('user_id', user.id)
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

  const isLoading = profileLoading || brandLoading;

  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      ) : (
        <PageHeader 
          title={`Welcome back, ${profile?.first_name || 'there'}!`}
          description={`Here's what's happening with ${brand?.company_name || 'your brand'} today.`}
        />
      )}

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages />
        <QuickNotes />
      </div>
    </div>
  );
};

export default BrandDashboard;