import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthCheck } from "@/hooks/use-auth-check";
import { motion, AnimatePresence } from "framer-motion";

interface ProtectedBrandRouteProps {
  children: ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const { isLoading, hasAccess } = useAuthCheck();

  if (!hasAccess && !isLoading) {
    return <Navigate to="/signin" />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ProtectedBrandRoute;