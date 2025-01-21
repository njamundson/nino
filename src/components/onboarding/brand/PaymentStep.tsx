import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PaymentStep = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleComplete = () => {
    // Navigate to welcome page first
    navigate('/brand/welcome');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Whoo whoo!</h1>
        <p className="text-nino-gray text-sm">You're all set—welcome to Nino!</p>
      </div>

      <Button 
        className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
        onClick={handleComplete}
      >
        Complete Setup
      </Button>
    </div>
  );
};

export default PaymentStep;