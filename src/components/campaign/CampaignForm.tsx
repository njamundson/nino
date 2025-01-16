import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BasicInfo from "./steps/BasicInfo";
import Requirements from "./steps/Requirements";
import Compensation from "./steps/Compensation";
import SuccessModal from "./SuccessModal";

type Step = {
  title: string;
  description: string;
  component: React.ComponentType<any>;
};

const steps: Step[] = [
  {
    title: "Basic Information",
    description: "Let's start with the core details of your project",
    component: BasicInfo,
  },
  {
    title: "Requirements",
    description: "Define what you're looking for",
    component: Requirements,
  },
  {
    title: "Compensation",
    description: "Set your budget and additional perks",
    component: Compensation,
  },
];

const CampaignForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    requirements: [] as string[],
    deliverables: [] as string[],
    paymentDetails: "",
    compensationDetails: "",
  });

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    setShowSuccessModal(true);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-medium tracking-tight text-gray-900">
          {steps[currentStep].title}
        </h2>
        <p className="text-gray-500 text-lg">
          {steps[currentStep].description}
        </p>
      </div>

      <Progress value={progress} className="h-1 bg-gray-100" />

      <div className="min-h-[400px] py-4">
        <CurrentStepComponent
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="text-gray-600 hover:text-gray-900"
        >
          Back
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-900 text-white px-8"
          >
            Create Campaign
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="bg-black hover:bg-gray-900 text-white px-8"
          >
            Continue
          </Button>
        )}
      </div>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onOpenChange={setShowSuccessModal}
      />
    </div>
  );
};

export default CampaignForm;