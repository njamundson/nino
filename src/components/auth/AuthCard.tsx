import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const fadeVariants = {
  enter: {
    opacity: 0
  },
  center: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
};

const AuthCard = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check if user has any existing profiles
        const { data: profileStatus, error } = await supabase
          .rpc('check_user_profile_status', {
            user_uuid: session.user.id
          });

        if (error) {
          console.error("Error checking profile status:", error);
          return;
        }

        if (profileStatus) {
          if (profileStatus.has_brand) {
            navigate("/brand/dashboard", { replace: true });
          } else if (profileStatus.has_creator) {
            navigate("/creator/dashboard", { replace: true });
          } else {
            navigate("/onboarding", { replace: true });
          }
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        const { data: profileStatus, error } = await supabase
          .rpc('check_user_profile_status', {
            user_uuid: session.user.id
          });

        if (error) {
          console.error("Error checking profile status:", error);
          return;
        }

        if (profileStatus) {
          if (profileStatus.has_brand) {
            navigate("/brand/dashboard", { replace: true });
          } else if (profileStatus.has_creator) {
            navigate("/creator/dashboard", { replace: true });
          } else {
            navigate("/onboarding", { replace: true });
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? "signin" : "signup"}
            variants={fadeVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.2 }
            }}
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