import CreatorDashboard from "@/components/dashboard/CreatorDashboard";
import Sidebar from "@/components/dashboard/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <CreatorDashboard />
      </div>
    </div>
  );
};

export default Dashboard;