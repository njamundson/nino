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
    <div className="flex justify-between pt-4 border-t border-gray-100">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={currentStep === 0}
        className="text-gray-500 hover:text-gray-900 text-sm font-medium px-3"
      >
        Back
      </Button>
      
      {currentStep === totalSteps - 1 ? (
        <Button 
          onClick={onSubmit}
          className="bg-black hover:bg-gray-900 text-white px-5 text-sm font-medium rounded-lg"
        >
          Create Campaign
        </Button>
      ) : (
        <Button 
          onClick={onNext}
          className="bg-black hover:bg-gray-900 text-white px-5 text-sm font-medium rounded-lg"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;