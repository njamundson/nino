import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="w-full max-w-md p-6">
      <div className="space-y-8">
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <img
            src="/lovable-uploads/b6aee870-d05a-4e6f-b275-48d95b773ac9.png"
            alt="NINO"
            className="h-24"
          />
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isSignIn ? "signin" : "signup"}
            initial={{ opacity: 0, x: isSignIn ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignIn ? 20 : -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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