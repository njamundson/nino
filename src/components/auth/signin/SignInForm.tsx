import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignInFormProps {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
}

const SignInForm = ({ onSubmit, loading }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { formData, errors, validateForm, handleChange } = useAuthForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loading && validateForm()) {
      try {
        await onSubmit(formData.email, formData.password);
      } catch (error) {
        console.error('Sign in error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={`h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] transition-all duration-300 ${
              errors.email ? "ring-2 ring-red-500" : ""
            }`}
            required
            disabled={loading}
            autoComplete="email"
          />
          {errors.email && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.email}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className={`h-12 bg-[#f3f3f3] border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-nino-primary/20 hover:bg-[#F9F6F2] pr-10 transition-all duration-300 ${
              errors.password ? "ring-2 ring-red-500" : ""
            }`}
            required
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-nino-gray hover:text-nino-primary transition-colors duration-300"
            disabled={loading}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
          {errors.password && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.password}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-nino-primary hover:opacity-90 text-white transition-all duration-300 rounded-xl h-12 shadow-sm focus-visible:ring-2 focus-visible:ring-[#A55549] focus-visible:ring-offset-2"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
};

export default SignInForm;