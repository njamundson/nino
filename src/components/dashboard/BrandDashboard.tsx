import { useAuth } from "@/hooks/useAuth";
import { useBrandProfile } from "@/hooks/useBrandProfile";
import BrandStatsCards from "./stats/BrandStatsCards";
import RecentMessages from "./messages/RecentMessages";
import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BrandDashboard = () => {
  const { session } = useAuth();
  const { data: brandProfile, isLoading, error } = useBrandProfile(session?.user?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>
            There was an error loading your dashboard. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!brandProfile) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>
            Please complete your brand profile to access the dashboard.
          </AlertDescription>
        </Alert>
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