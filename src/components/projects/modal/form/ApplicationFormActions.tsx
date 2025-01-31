import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ApplicationFormActionsProps {
  onBack: () => void;
  isSubmitting: boolean;
}

const ApplicationFormActions = ({ onBack, isSubmitting }: ApplicationFormActionsProps) => {
  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="rounded-full hover:bg-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      <Button
        type="submit"
        className="px-8 py-2.5 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-full transition-colors"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Submitting...</span>
          </div>
        ) : (
          "Submit Application"
        )}
      </Button>
    </div>
  );
};

export default ApplicationFormActions;