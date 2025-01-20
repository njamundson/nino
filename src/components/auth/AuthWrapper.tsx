import { useEffect } from "react";
import { useAuthState } from "@/hooks/useAuthState";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isInitialized, isError } = useAuthState();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      toast({
        title: "Authentication Error",
        description: "There was a problem with your session. Please try logging in again.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isError, toast, navigate]);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;