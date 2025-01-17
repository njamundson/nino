import { motion } from "framer-motion";
import { useBrandOnboarding } from "@/hooks/useBrandOnboarding";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import BrandDetailsStep from "./brand/BrandDetailsStep";
import BrandSocialStep from "./brand/BrandSocialStep";
import BrandOnboardingProgress from "./brand/BrandOnboardingProgress";
import BrandOnboardingNavigation from "./brand/BrandOnboardingNavigation";
import AccountManagersStep from "./brand/managers/AccountManagersStep";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentStep,
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
  } = useBrandOnboarding();

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive",
        });
        return;
      }

      // Get the brand ID for the current user
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        toast({
          title: "Error",
          description: "Could not find brand information",
          variant: "destructive",
        });
        return;
      }

      // If no brand was found, show an error
      if (!brand) {
        toast({
          title: "Error",
          description: "Brand profile not found. Please complete the basic information first.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Brand setup completed successfully",
      });

      navigate("/brand/dashboard");
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
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
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-6 rounded-xl shadow-sm"
      >
        <BrandOnboardingProgress currentStep={currentStep} />
        {getCurrentStep()}
        <BrandOnboardingNavigation
          currentStep={currentStep}
          onBack={handleBack}
          onNext={currentStep === 'managers' ? handleComplete : handleNext}
        />
      </motion.div>
    </div>
  );
};

export default BrandOnboarding;