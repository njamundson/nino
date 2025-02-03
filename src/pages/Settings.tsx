import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreatorSettings } from "@/components/settings/creator/CreatorSettings";
import BrandSettings from "@/components/settings/brand/pages/BrandProfileSettings";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<"brand" | "creator" | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkUserType = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        // Check for brand profile using maybeSingle()
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error checking brand profile:', brandError);
          throw brandError;
        }

        if (brand) {
          if (mounted) {
            setUserType('brand');
            setIsLoading(false);
          }
          return;
        }

        // Check for creator profile using maybeSingle()
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) {
          console.error('Error checking creator profile:', creatorError);
          throw creatorError;
        }

        if (creator && mounted) {
          setUserType('creator');
        }

      } catch (error) {
        console.error('Error in checkUserType:', error);
        if (mounted) {
          toast({
            title: "Error loading settings",
            description: "Please try refreshing the page.",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUserType(null);
          setIsLoading(false);
        }
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkUserType();
      }
    });

    // Initial check
    void checkUserType();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userType) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Unable to load settings. Please try again later.</p>
      </div>
    );
  }

  return userType === 'brand' ? (
    <BrandSettings onBack={() => window.history.back()} />
  ) : (
    <CreatorSettings />
  );
};

export default Settings;