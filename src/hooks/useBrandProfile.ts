import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useBrandProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["brandProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("brands")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching brand profile:", error);
        return null;
      }

      return data;
    },
    enabled: !!userId,
  });
};