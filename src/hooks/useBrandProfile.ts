import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useBrandProfile = (userId: string | undefined) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["brandProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching brand profile:", error);
        toast({
          title: "Error",
          description: "Failed to load brand profile",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!userId,
    retry: 1,
  });
};