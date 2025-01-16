import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BrandBasicInfoStep from "./BrandBasicInfoStep";
import BrandDetailsStep from "./BrandDetailsStep";
import BrandSocialStep from "./BrandSocialStep";

type BrandStep = 'basic' | 'details' | 'social';

const BrandOnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BrandStep>('basic');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState({
    brandName: "",
    brandEmail: "",
    brandBio: "",
    homeLocation: "",
    instagram: "",
    website: "",
    location: "",
  });

  const updateField = (field: string, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'basic':
        return 'w-1/3';
      case 'details':
        return 'w-2/3';
      case 'social':
        return 'w-full';
      default:
        return 'w-1/3';
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
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (currentStep === 'basic') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('social');
    } else {
      navigate("/onboarding/brand/managers");
    }
  };

  const handleBack = () => {
    if (currentStep === 'social') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('basic');
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-6 rounded-xl shadow-sm"
      >
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-nino-primary rounded-full transition-all duration-500 ease-in-out ${getStepProgress()}`}
          />
        </div>

        {/* Steps */}
        {getCurrentStep()}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            onClick={handleBack}
            variant="outline"
            className="text-nino-gray hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8"
          >
            {currentStep === 'social' ? 'Add Team Members' : 'Next'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandOnboardingFlow;