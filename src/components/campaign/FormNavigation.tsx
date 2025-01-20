import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext, 
  onSubmit 
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between pt-6 border-t border-gray-100">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={currentStep === 0}
        className="text-gray-600 hover:text-gray-900"
      >
        Back
      </Button>
      
      {currentStep === totalSteps - 1 ? (
        <Button 
          onClick={onSubmit}
          className="bg-black hover:bg-gray-900 text-white px-8"
        >
          Create Campaign
        </Button>
      ) : (
        <Button 
          onClick={onNext}
          className="bg-black hover:bg-gray-900 text-white px-8"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;