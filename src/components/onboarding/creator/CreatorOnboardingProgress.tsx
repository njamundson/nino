import { motion } from "framer-motion";

interface CreatorOnboardingProgressProps {
  currentStep: 'basic' | 'professional' | 'social' | 'payment';
}

const CreatorOnboardingProgress = ({ currentStep }: CreatorOnboardingProgressProps) => {
  const getStepProgress = () => {
    switch (currentStep) {
      case 'basic':
        return 'w-1/4';
      case 'professional':
        return 'w-2/4';
      case 'social':
        return 'w-3/4';
      case 'payment':
        return 'w-full';
      default:
        return 'w-1/4';
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

export default CreatorOnboardingProgress;