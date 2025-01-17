interface BrandOnboardingProgressProps {
  currentStep: 'basic' | 'details' | 'social' | 'managers';
}

const BrandOnboardingProgress = ({ currentStep }: BrandOnboardingProgressProps) => {
  const steps = ['basic', 'details', 'social', 'managers'];
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full flex justify-between items-center mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index <= currentIndex ? 'bg-nino-primary' : 'bg-gray-200'
            }`}
          />
          {index < steps.length - 1 && (
            <div
              className={`h-[2px] w-[calc(100%-12px)] mx-1.5 transition-colors duration-200 ${
                index < currentIndex ? 'bg-nino-primary' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BrandOnboardingProgress;