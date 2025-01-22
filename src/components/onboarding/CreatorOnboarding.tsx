import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import CreatorOnboardingForm from "./creator/CreatorOnboardingForm";
import { supabase } from "@/integrations/supabase/client";

const CreatorOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = async (data: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session");
      }

      // Update creator profile and mark onboarding as complete
      const { error } = await supabase
        .from('creators')
        .update({
          bio: data.bio,
          location: data.location,
          instagram: data.instagram,
          website: data.website,
          specialties: data.specialties,
          creator_type: data.creatorType,
          profile_image_url: data.profileImage,
          onboarding_completed: true
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Navigate to welcome screen
      navigate("/onboarding/creator/welcome");
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  return <CreatorOnboardingForm onComplete={handleComplete} />;
};

export default CreatorOnboarding;