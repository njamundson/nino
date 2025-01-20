import { ReactNode, Suspense } from "react";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface BrandLayoutProps {
  children: ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-[80vh]">
    <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
  </div>
);

const BrandLayout = ({ children }: BrandLayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/brand/dashboard";

  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-8">
          {!isDashboard && <DashboardHeader />}
          <Suspense fallback={<LoadingSpinner />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default BrandLayout;