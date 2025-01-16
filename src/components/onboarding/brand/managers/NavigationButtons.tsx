import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavigationButtonsProps {
  onComplete: () => void;
}

const NavigationButtons = ({ onComplete }: NavigationButtonsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between pt-4">
      <Button
        onClick={() => navigate("/onboarding/brand")}
        variant="outline"
        className="text-nino-gray hover:bg-gray-50"
      >
        Back
      </Button>
      <Button
        onClick={onComplete}
        className="bg-nino-primary hover:bg-nino-primary/90 text-white"
      >
        Complete Setup
      </Button>
    </div>
  );
};

export default NavigationButtons;