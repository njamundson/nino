import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CreatorSettings from "@/components/settings/creator/CreatorSettings";
import BrandSettings from "@/components/settings/brand/pages/BrandProfileSettings";
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Settings = () => {
  const [userType, setUserType] = useState<"brand" | "creator" | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUserType = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user is a brand
        const { data: brand } = await supabase
          .from("brands")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (brand) {
          setUserType("brand");
          setLoading(false);
          return;
        }

        // Check if user is a creator
        const { data: creator } = await supabase
          .from("creators")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (creator) {
          setUserType("creator");
        }
      } catch (error) {
        console.error("Error checking user type:", error);
        toast({
          title: "Error",
          description: "Failed to load settings. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkUserType();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {userType === "brand" ? (
        <BrandSettings onBack={() => {}} />
      ) : (
        <CreatorSettings />
      )}
    </>
  );
};

export default Settings;