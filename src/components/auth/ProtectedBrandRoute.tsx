import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedBrandRouteProps {
  children: React.ReactNode;
}

const ProtectedBrandRoute = ({ children }: ProtectedBrandRouteProps) => {
  const { data: brand, isLoading } = useQuery({
    queryKey: ["brand-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: brand } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", user.id)
        .single();

      return brand;
    },
  });

  if (isLoading) {
    return null;
  }

  if (!brand) {
    return <Navigate to="/onboarding" />;
  }

  return <>{children}</>;
};

export default ProtectedBrandRoute;