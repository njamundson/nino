import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PaymentStepProps {
  paymentDetails: string;
  onUpdateField: (field: string, value: string) => void;
}

const PaymentStep = ({ paymentDetails, onUpdateField }: PaymentStepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Payment Details</h1>
        <p className="text-nino-gray text-sm">How would you like to get paid?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base">Payment Information *</Label>
          <Input
            value={paymentDetails}
            onChange={(e) => onUpdateField("paymentDetails", e.target.value)}
            placeholder="Enter your payment details"
            className="bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;