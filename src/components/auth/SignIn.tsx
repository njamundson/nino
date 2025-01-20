import { useState } from "react";
import ResetPassword from "./ResetPassword";
import SignInForm from "./signin/SignInForm";
import SignInHeader from "./signin/SignInHeader";
import { useSignInWithEmail } from "@/hooks/useSignInWithEmail";

interface SignInProps {
  onToggleAuth: () => void;
}

const SignIn = ({ onToggleAuth }: SignInProps) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { loading, signIn } = useSignInWithEmail();

  return (
    <div className="space-y-6">
      <SignInHeader 
        title="Welcome back" 
        subtitle="Sign in to continue" 
      />

      <SignInForm 
        onSubmit={signIn}
        loading={loading}
      />

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

      <ResetPassword 
        isOpen={showResetPassword} 
        onClose={() => setShowResetPassword(false)} 
      />
    </div>
  );
};

export default SignIn;