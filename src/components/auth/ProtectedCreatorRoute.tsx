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

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify subscription status. Please try again.",
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (!isLoading && !error && !data?.subscribed) {
      toast({
        variant: "destructive",
        title: "Subscription Required",
        description: "Please subscribe to access creator features.",
      });
    }
  }, [data?.subscribed, isLoading, error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (error || !data?.subscribed) {
    return <Navigate to="/onboarding/creator" replace />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;