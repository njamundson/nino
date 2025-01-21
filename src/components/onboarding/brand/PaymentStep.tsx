import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PaymentStep = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/brand/welcome');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <img 
        src="/lovable-uploads/7f312cab-6543-4c35-bf2f-5e8e832f9fa9.png"
        alt="Nino"
        className="w-48 h-auto mb-8"
      />
      <Button 
        className="bg-nino-primary hover:bg-nino-primary/90 text-white"
        onClick={handleComplete}
      >
        Complete Setup
      </Button>
    </div>
  );
};

export default PaymentStep;