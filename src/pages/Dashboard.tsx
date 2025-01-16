import CreatorDashboard from "@/components/dashboard/CreatorDashboard";
import PageHeader from "@/components/shared/PageHeader";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Creator Dashboard"
        description="Welcome to your Nino Creator Platform dashboard"
      />
      <CreatorDashboard />
    </div>
  );
};

export default Dashboard;