import { useAuth } from "@/hooks/useAuth";
import { useBrandProfile } from "@/hooks/useBrandProfile";
import BrandStatsCards from "./stats/BrandStatsCards";
import RecentMessages from "./messages/RecentMessages";
import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import { LoadingSpinner } from "@/components/ui/loading";
import { ErrorAlert } from "@/components/ui/error-alert";

const BrandDashboard = () => {
  const { session } = useAuth();
  const { 
    data: brandProfile, 
    isLoading, 
    error 
  } = useBrandProfile(session?.user?.id);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorAlert message="There was an error loading your dashboard. Please try again later." />
    );
  }

  if (!brandProfile) {
    return (
      <ErrorAlert message="Please complete your brand profile to access the dashboard." />
    );
  }

  return (
    <div className="space-y-8">
      <DashboardHeader />
      <BrandStatsCards />
      <DashboardContent />
    </div>
  );
};

const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentMessages />
      <QuickNotes />
    </div>
  );
};

export default BrandDashboard;