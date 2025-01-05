import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import ResetPassword from "./ResetPassword";

interface SignInProps {
  onToggleAuth: () => void;
}

const SignIn = ({ onToggleAuth }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call - will be replaced with Supabase
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Welcome back</h1>
        <p className="text-nino-gray text-sm">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email address"
            className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 transition-all duration-300"
            required
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 pr-10 transition-all duration-300"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-nino-gray hover:text-nino-primary transition-colors duration-300"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowResetPassword(true)}
            className="text-sm text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-nino-primary hover:opacity-90 text-white transition-all duration-300 rounded-xl h-12 shadow-sm"
          disabled={loading}
        >
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Signing in...</span>
            </motion.div>
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center text-sm text-nino-gray">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onToggleAuth}
            className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
          >
            Create one
          </button>
        </div>
      </form>

      <ResetPassword 
        isOpen={showResetPassword} 
        onClose={() => setShowResetPassword(false)} 
      />
    </div>
  );
};

export default SignIn;