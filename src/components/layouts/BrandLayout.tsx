import { ReactNode, Suspense } from "react";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

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
        <Suspense 
          fallback={
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
              <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export default BrandLayout;