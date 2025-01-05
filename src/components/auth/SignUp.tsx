import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return 0;
    if (pass.length < 6) return 1;
    if (pass.length < 10) return 2;
    return 3;
  };

  const strengthColors = [
    "bg-transparent",
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
  ];

  const strengthTexts = ["", "Weak", "Medium", "Strong"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Account created!",
      description: "Welcome to NINO. Please check your email to verify your account.",
    });
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="text"
          placeholder="First Name"
          className="bg-white/50 border-nino-gray/20 focus:border-nino-primary transition-all duration-300"
          required
        />
        <Input
          type="text"
          placeholder="Last Name"
          className="bg-white/50 border-nino-gray/20 focus:border-nino-primary transition-all duration-300"
          required
        />
      </div>

      <Input
        type="email"
        placeholder="Email"
        className="bg-white/50 border-nino-gray/20 focus:border-nino-primary transition-all duration-300"
        required
      />

      <div className="space-y-2 relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        {password && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2"
          >
            <div className="flex space-x-2 h-1">
              {[1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-full transition-colors duration-300 ${
                    strengthColors[
                      getPasswordStrength(password) >= index
                        ? getPasswordStrength(password)
                        : 0
                    ]
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-nino-gray mt-1">
              Password strength:{" "}
              {strengthTexts[getPasswordStrength(password)]}
            </p>
          </motion.div>
        )}
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
            <span>Creating account...</span>
          </motion.div>
        ) : (
          "Sign Up"
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

export default SignUp;