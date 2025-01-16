import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProtectedCreatorRouteProps {
  children: React.ReactNode;
}

const ProtectedCreatorRoute = ({ children }: ProtectedCreatorRouteProps) => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: creator } = useQuery({
    queryKey: ['creator-profile'],
    enabled: !!session?.user,
    queryFn: async () => {
      const { data } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', session?.user.id)
        .single();
      return data;
    },
  });

  useEffect(() => {
    if (!session) {
      navigate('/');
      return;
    }

    if (session && !creator) {
      navigate('/onboarding');
    }
  }, [session, creator, navigate]);

  if (!session || !creator) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedCreatorRoute;