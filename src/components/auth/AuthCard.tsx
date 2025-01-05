import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <Card className="w-full max-w-md p-6 bg-white/80 backdrop-blur-lg shadow-lg rounded-2xl">
      <div className="space-y-6">
        <div className="flex justify-center mb-8">
          <motion.img
            src="/lovable-uploads/2c6f50b1-d9d4-4d81-8d8c-1978d336487b.png"
            alt="NINO"
            className="h-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isSignIn
                ? "text-nino-primary border-b-2 border-nino-primary"
                : "text-nino-gray hover:text-nino-primary"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
              !isSignIn
                ? "text-nino-primary border-b-2 border-nino-primary"
                : "text-nino-gray hover:text-nino-primary"
            }`}
          >
            Sign Up
          </button>
        </div>

        <motion.div
          key={isSignIn ? "signin" : "signup"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {isSignIn ? <SignIn /> : <SignUp />}
        </motion.div>
      </div>
    </Card>
  );
};

export default AuthCard;