import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0
  })
};

const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="w-full max-w-md p-6">
      <div className="space-y-8">
        <div className="flex justify-center mb-8">
          <img
            src="/lovable-uploads/b6aee870-d05a-4e6f-b275-48d95b773ac9.png"
            alt="NINO"
            className="h-24"
          />
        </div>

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={isSignIn ? "signin" : "signup"}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            {isSignIn ? (
              <SignIn onToggleAuth={() => paginate(1)} />
            ) : (
              <SignUp onToggleAuth={() => paginate(-1)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthCard;