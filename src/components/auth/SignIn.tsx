import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Eye, EyeOff } from "lucide-react";
import ResetPassword from "./ResetPassword";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { AuthError } from "@supabase/supabase-js";

interface SignInProps {
  onToggleAuth: () => void;
}

const SignIn = ({ onToggleAuth }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Starting sign in process...");
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        let errorMessage = "Failed to sign in";
        
        if (signInError instanceof AuthError) {
          switch (signInError.message) {
            case "Invalid login credentials":
              errorMessage = "Invalid email or password. Please try again.";
              break;
            case "Email not confirmed":
              errorMessage = "Please verify your email before signing in.";
              break;
            default:
              errorMessage = signInError.message;
          }
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (signInData.user) {
        // Check if user has a creator profile
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', signInData.user.id)
          .single();

        if (creatorError && creatorError.code !== 'PGRST116') {
          console.error("Error fetching creator profile:", creatorError);
          toast({
            title: "Error",
            description: "Failed to fetch user profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (creator) {
          console.log("Creator profile found, redirecting to dashboard");
          navigate('/dashboard');
        } else {
          console.log("No creator profile found, redirecting to onboarding");
          navigate('/onboarding');
        }

        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300"
            required
            disabled={loading}
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] pr-10 transition-all duration-300"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-nino-gray hover:text-nino-primary transition-colors duration-300"
              disabled={loading}
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
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-nino-primary hover:opacity-90 text-white transition-all duration-300 rounded-xl h-12 shadow-sm focus-visible:ring-2 focus-visible:ring-[#A55549] focus-visible:ring-offset-2"
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
            disabled={loading}
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