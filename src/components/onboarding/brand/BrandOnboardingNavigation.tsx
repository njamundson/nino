interface BrandOnboardingNavigationProps {
  currentStep: 'basic' | 'details' | 'social' | 'managers';
  onNext: () => void;
  onBack: () => void;
}

const BrandOnboardingNavigation = ({
  currentStep,
  onNext,
  onBack,
}: BrandOnboardingNavigationProps) => {
  return (
    <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
      <button
        onClick={onBack}
        className="text-nino-gray hover:text-nino-text transition-colors px-6 py-2.5 rounded-lg hover:bg-gray-50"
      >
        Back
      </button>
      <button
        onClick={onNext}
        className="bg-nino-primary text-white px-8 py-2.5 rounded-lg hover:bg-nino-primary/90 transition-colors"
      >
        {currentStep === 'managers' ? 'Complete' : 'Continue'}
      </button>
    </div>
  );
};

export default BrandOnboardingNavigation;