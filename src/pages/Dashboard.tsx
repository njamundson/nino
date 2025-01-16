import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { MessagesSection } from "@/components/dashboard/MessagesSection";
import { EarningsOverview } from "@/components/dashboard/EarningsOverview";
import { QuickNotes } from "@/components/dashboard/QuickNotes";
import { ActiveProjects } from "@/components/dashboard/ActiveProjects";
import { ExploreOpportunities } from "@/components/dashboard/ExploreOpportunities";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/');
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-nino-bg">
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="p-6 space-y-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <WelcomeSection />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <MessagesSection />
                  <QuickNotes />
                </div>
                <div className="space-y-6">
                  <EarningsOverview />
                  <ActiveProjects />
                </div>
              </div>
              <ExploreOpportunities />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}