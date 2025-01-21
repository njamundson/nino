import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCreator = location.pathname.includes('/creator');

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isCreator ? "/creator/dashboard" : "/brand/dashboard", { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, isCreator]);

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="text-center space-y-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl font-medium text-nino-primary"
        >
          Welcome to Nino
        </motion.h1>
        {!isCreator && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-nino-gray"
          >
            Let's find amazing creators
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Welcome;