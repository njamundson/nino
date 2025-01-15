import { Navigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const { data, isLoading } = useSubscription();
  const { toast } = useToast();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.subscribed) {
    toast({
      variant: "destructive",
      title: "Subscription Required",
      description: "Please subscribe to access creator features.",
    });
    return <Navigate to="/onboarding/creator" replace />;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;