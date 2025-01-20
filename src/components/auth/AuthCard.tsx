import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);

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

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isSignIn ? "signin" : "signup"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            {isSignIn ? (
              <SignIn onToggleAuth={() => setIsSignIn(false)} />
            ) : (
              <SignUp onToggleAuth={() => setIsSignIn(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuthCard;