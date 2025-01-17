import { Button } from "@/components/ui/button";

interface BrandOnboardingNavigationProps {
  currentStep: 'basic' | 'details' | 'social' | 'managers';
  onBack: () => void;
  onNext: () => void;
}

const BrandOnboardingNavigation = ({
  currentStep,
  onBack,
  onNext,
}: BrandOnboardingNavigationProps) => {
  return (
    <div className="flex justify-between pt-6">
      <Button
        onClick={onBack}
        variant="outline"
        className="text-nino-gray hover:bg-gray-50"
      >
        Back
      </Button>
      <Button
        onClick={onNext}
        className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8"
      >
        {currentStep === 'managers' ? 'Complete Setup' : 'Next'}
      </Button>
    </div>
  );
};

export default BrandOnboardingNavigation;