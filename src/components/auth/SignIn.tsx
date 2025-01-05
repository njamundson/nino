import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    });
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Email"
          className="bg-white/50 border-nino-gray/20 focus:border-nino-primary transition-all duration-300"
          required
        />
      </div>

      <div className="space-y-2 relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="bg-white/50 border-nino-gray/20 focus:border-nino-primary pr-10 transition-all duration-300"
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

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2 text-nino-gray">
          <input type="checkbox" className="rounded border-nino-gray/20" />
          <span>Remember me</span>
        </label>
        <button
          type="button"
          className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white transition-all duration-300"
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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-nino-gray/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-nino-gray">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          className="border-nino-gray/20 hover:bg-nino-primary/5 transition-all duration-300"
        >
          Google
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-nino-gray/20 hover:bg-nino-primary/5 transition-all duration-300"
        >
          Apple
        </Button>
      </div>
    </form>
  );
};

export default SignIn;