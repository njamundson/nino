import { motion } from "framer-motion";

interface BrandOnboardingProgressProps {
  currentStep: 'basic' | 'details' | 'social' | 'managers';
}

const steps = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'details', label: 'Details' },
  { key: 'social', label: 'Social' },
  { key: 'managers', label: 'Team' },
] as const;

const BrandOnboardingProgress = ({ currentStep }: BrandOnboardingProgressProps) => {
  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <motion.div
              initial={false}
              animate={{
                scale: currentIndex >= index ? 1.1 : 1,
                backgroundColor: currentIndex >= index ? 'rgb(165, 85, 73)' : 'rgb(229, 231, 235)',
              }}
              className="w-3 h-3 rounded-full"
            />
            {index < steps.length - 1 && (
              <div
                className="w-full h-0.5 mx-2"
                style={{
                  backgroundColor: currentIndex > index ? 'rgb(165, 85, 73)' : 'rgb(229, 231, 235)',
                  width: '100%',
                  transition: 'background-color 0.3s ease',
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <span
            key={step.key}
            className={`text-xs ${
              currentIndex >= index ? 'text-nino-primary' : 'text-gray-400'
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BrandOnboardingProgress;