import { useBrandOnboarding } from "@/hooks/useBrandOnboarding";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import BrandDetailsStep from "./brand/BrandDetailsStep";
import BrandSocialStep from "./brand/BrandSocialStep";
import BrandOnboardingProgress from "./brand/BrandOnboardingProgress";
import BrandOnboardingNavigation from "./brand/BrandOnboardingNavigation";
import AccountManagersStep from "./brand/managers/AccountManagersStep";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BrandOnboardingContainer from "./brand/BrandOnboardingContainer";
import { supabase } from "@/integrations/supabase/client";

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentStep,
    setCurrentStep,
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
  } = useBrandOnboarding();

  const handleComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session");
      }

      if (!brandData.company_name) {
        toast({
          title: "Error",
          description: "Please provide a brand name before continuing.",
          variant: "destructive",
        });
        setCurrentStep('basic');
        return;
      }

      // Update brand profile and mark onboarding as complete
      const { error } = await supabase
        .from('brands')
        .update({
          company_name: brandData.company_name,
          brand_type: brandData.brand_type,
          description: brandData.description,
          website: brandData.website,
          instagram: brandData.instagram,
          location: brandData.location,
          profile_image_url: profileImage,
          onboarding_completed: true
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      // Navigate to welcome screen
      navigate("/onboarding/brand/payment");
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BrandBasicInfoStep
            profileImage={profileImage}
            brandData={brandData}
            onUpdateField={updateField}
            onUpdateImage={setProfileImage}
          />
        );
      case 'details':
        return (
          <BrandDetailsStep
            brandData={brandData}
            onUpdateField={updateField}
          />
        );
      case 'social':
        return (
          <BrandSocialStep
            brandData={brandData}
            onUpdateField={updateField}
          />
        );
      case 'managers':
        return <AccountManagersStep />;
      default:
        return null;
    }
  };

  return (
    <BrandOnboardingContainer>
      <BrandOnboardingProgress currentStep={currentStep} />
      {getCurrentStep()}
      <BrandOnboardingNavigation
        currentStep={currentStep}
        onBack={handleBack}
        onNext={currentStep === 'managers' ? handleComplete : handleNext}
      />
    </BrandOnboardingContainer>
  );
};

export default BrandOnboarding;