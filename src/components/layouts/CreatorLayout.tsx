import { ReactNode } from "react";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";

interface CreatorLayoutProps {
  children: ReactNode;
}

const CreatorLayout = ({ children }: CreatorLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default CreatorLayout;