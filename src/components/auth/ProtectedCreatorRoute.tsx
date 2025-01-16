import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const { data, isLoading, error } = useSubscription();
  const { toast } = useToast();

  // Commenting out subscription checks for testing purposes
  useEffect(() => {
    if (error) {
      console.log("Subscription verification error:", error);
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  // Temporarily returning children directly for testing
  return <>{children}</>;
};

export default ProtectedCreatorRoute;