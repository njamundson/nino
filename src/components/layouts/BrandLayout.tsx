import { ReactNode } from "react";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useLocation } from "react-router-dom";

interface BrandLayoutProps {
  children: ReactNode;
}

const BrandLayout = ({ children }: BrandLayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/brand/dashboard";

  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        {!isDashboard && <DashboardHeader />}
        {children}
      </div>
    </div>
  );
};

export default BrandLayout;