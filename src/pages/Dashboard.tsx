import BrandDashboard from "@/components/dashboard/BrandDashboard";
import CreatorDashboard from "@/components/dashboard/CreatorDashboard";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const isBrandDashboard = location.pathname.startsWith("/brand");

  return isBrandDashboard ? <BrandDashboard /> : <CreatorDashboard />;
};

export default Dashboard;