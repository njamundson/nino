import { motion } from "framer-motion";

interface BrandOnboardingProgressProps {
  currentStep: 'basic' | 'details' | 'social';
}

const BrandOnboardingProgress = ({ currentStep }: BrandOnboardingProgressProps) => {
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

  return (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <motion.div
        className={`h-full bg-nino-primary rounded-full transition-all duration-500 ease-in-out ${getStepProgress()}`}
      />
    </div>
  );
};

export default BrandOnboardingProgress;