import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthError } from "@supabase/supabase-js";
import EmailField from "./form-fields/EmailField";
import PasswordField from "./form-fields/PasswordField";
import NameFields from "./form-fields/NameFields";
import SubmitButton from "./form-fields/SubmitButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";

type AuthMode = "signIn" | "signUp" | "resetPassword";

const AuthFlow = () => {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("No user found");

      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (creatorError && creatorError.code !== 'PGRST116') {
        throw creatorError;
      }

      toast({
        title: "Welcome back!",
      });

      if (creator) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      toast({
        title: "Welcome to NINO",
      });
      
      navigate("/onboarding");
    } catch (error: any) {
      console.error("Authentication error:", error);
      let errorMessage = "Error creating account";
      
      if (error instanceof AuthError) {
        switch (error.message) {
          case "Failed to fetch":
            errorMessage = "Network error. Please check your connection and try again.";
            break;
          case "User already registered":
            errorMessage = "An account with this email already exists.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;
      
      toast({
        title: "Reset link sent!",
        description: "Please check your email for password reset instructions.",
      });
      
      setMode("signIn");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (mode) {
      case "signIn":
        return (
          <form onSubmit={handleSignIn} className="space-y-4">
            <EmailField email={email} onChange={setEmail} />
            <PasswordField password={password} onChange={setPassword} />
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setMode("resetPassword")}
                className="text-sm text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
              >
                Forgot password?
              </button>
            </div>

            <SubmitButton
              loading={loading}
              text="Sign In"
              loadingText="Signing in..."
            />

            <div className="text-center text-sm text-nino-gray">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signUp")}
                className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
              >
                Create one
              </button>
            </div>
          </form>
        );

      case "signUp":
        return (
          <form onSubmit={handleSignUp} className="space-y-4">
            <NameFields
              firstName={firstName}
              lastName={lastName}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
            />

            <EmailField email={email} onChange={setEmail} />
            <PasswordField password={password} onChange={setPassword} />
            <PasswordField
              password={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm Password"
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <SubmitButton
              loading={loading}
              text="Sign Up"
              loadingText="Creating account..."
            />

            <div className="text-center text-sm text-nino-gray">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signIn")}
                className="text-nino-primary hover:text-nino-primary/80 transition-colors duration-300"
              >
                Sign in
              </button>
            </div>
          </form>
        );

      case "resetPassword":
        return (
          <Dialog open={mode === "resetPassword"} onOpenChange={() => setMode("signIn")}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-medium text-nino-text">Reset password</DialogTitle>
                <DialogDescription className="text-nino-gray text-sm">
                  Enter your email address and we'll send you instructions to reset your password.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                <EmailField email={email} onChange={setEmail} />
                <SubmitButton
                  loading={loading}
                  text="Send Reset Link"
                  loadingText="Sending..."
                />
              </form>
            </DialogContent>
          </Dialog>
        );
    }
  };

  return (
    <motion.div
      className="w-full max-w-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-8">
        <div className="flex justify-center mb-8">
          <motion.img
            src="/lovable-uploads/b6aee870-d05a-4e6f-b275-48d95b773ac9.png"
            alt="NINO"
            className="h-24"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        >
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-medium text-nino-text">
              {mode === "signIn" ? "Welcome back" : mode === "signUp" ? "Create account" : "Reset password"}
            </h1>
            <p className="text-nino-gray text-sm">
              {mode === "signIn" ? "Sign in to continue" : mode === "signUp" ? "Sign up to get started" : "Enter your email"}
            </p>
          </div>

          {renderForm()}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AuthFlow;