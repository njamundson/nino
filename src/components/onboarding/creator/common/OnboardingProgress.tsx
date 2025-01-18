import { Check } from "lucide-react";

type OnboardingStep = 'basic' | 'professional' | 'social' | 'payment';

interface OnboardingProgressProps {
  currentStep: OnboardingStep;
}

const steps = [
  { key: 'basic', label: 'Basic Info' },
  { key: 'professional', label: 'Professional' },
  { key: 'social', label: 'Social Links' },
  { key: 'payment', label: 'Payment' },
];

const OnboardingProgress = ({ currentStep }: OnboardingProgressProps) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const currentIndex = getCurrentStepIndex();
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center space-y-2"
            >
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-nino-primary text-white' : 
                    isCurrent ? 'bg-nino-primary/20 text-nino-primary' : 
                    'bg-gray-100 text-gray-400'}
                `}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className={`text-sm ${isCurrent ? 'text-nino-primary font-medium' : 'text-gray-500'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress;