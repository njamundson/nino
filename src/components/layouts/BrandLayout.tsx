import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/BrandSidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { AnimatePresence, motion } from "framer-motion";

const BrandLayout = () => {
  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden w-full">
        <div className="p-4 md:p-8">
          <div className="mb-8">
            <DashboardHeader />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default BrandLayout;