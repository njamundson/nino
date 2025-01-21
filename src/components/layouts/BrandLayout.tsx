import { ReactNode, Suspense } from "react";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface BrandLayoutProps {
  children: ReactNode;
}

const BrandLayout = ({ children }: BrandLayoutProps) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/brand/dashboard";

  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="p-8">
          {!isDashboard && <DashboardHeader />}
          <Suspense fallback={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="min-h-[80vh]"
            />
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default BrandLayout;