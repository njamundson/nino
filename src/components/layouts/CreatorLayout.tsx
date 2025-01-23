import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../dashboard/Sidebar";
import DashboardHeader from "../dashboard/header/DashboardHeader";
import { AnimatePresence, motion } from "framer-motion";

const CreatorLayout = () => {
  return (
    <div className="flex min-h-screen bg-nino-bg">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden w-full">
        <div className="fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="p-4 md:p-8">
            <DashboardHeader />
          </div>
        </div>
        <div className="p-4 pt-28 md:p-8 md:pt-32">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CreatorLayout;