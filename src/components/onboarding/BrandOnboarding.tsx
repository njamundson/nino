import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import AccountManagersStep from "./brand/AccountManagersStep";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
}

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'basic' | 'managers'>('basic');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState({
    brandName: "",
    brandEmail: "",
    brandBio: "",
  });
  const [accountManagers, setAccountManagers] = useState<AccountManager[]>([]);

  const updateField = (field: string, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const getStepProgress = () => {
    return currentStep === 'basic' ? 'w-1/2' : 'w-full';
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8 bg-white p-8 rounded-xl shadow-sm"
      >
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <motion.div
            className={`h-full bg-nino-primary rounded-full transition-all duration-500 ease-in-out ${getStepProgress()}`}
          />
        </div>

        {/* Steps */}
        {currentStep === 'basic' ? (
          <BrandBasicInfoStep
            profileImage={profileImage}
            onUpdateField={updateField}
            onUpdateImage={setProfileImage}
          />
        ) : (
          <AccountManagersStep
            accountManagers={accountManagers}
            onUpdateManagers={setAccountManagers}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            onClick={() => 
              currentStep === 'basic' 
                ? navigate("/onboarding")
                : setCurrentStep('basic')
            }
            variant="outline"
            className="text-nino-gray hover:bg-gray-50"
          >
            Back
          </Button>
          <Button
            onClick={() => 
              currentStep === 'basic'
                ? setCurrentStep('managers')
                : navigate("/")
            }
            className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8"
          >
            {currentStep === 'basic' ? 'Next' : 'Complete Profile'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BrandOnboarding;