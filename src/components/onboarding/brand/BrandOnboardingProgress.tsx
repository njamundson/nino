interface BrandOnboardingProgressProps {
  currentStep: "basic" | "details" | "social" | "managers";
}

const BrandOnboardingProgress = ({ currentStep }: BrandOnboardingProgressProps) => {
  const steps = [
    { id: "basic", label: "Basic Info" },
    { id: "details", label: "Brand Details" },
    { id: "social", label: "Social Links" },
    { id: "managers", label: "Account Managers" },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto pt-8 px-4">
      <div className="relative">
        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 -translate-y-1/2" />
        <div
          className="absolute left-0 top-1/2 h-0.5 bg-nino-primary -translate-y-1/2 transition-all duration-300"
          style={{
            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
          }}
        />
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    isCompleted
                      ? "bg-nino-primary text-white"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-nino-primary/20" : ""}`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    isCompleted ? "text-nino-primary" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BrandOnboardingProgress;