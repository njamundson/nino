import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompensationProps {
  formData: any;
  setFormData: (data: any) => void;
}

const Compensation = ({ formData, setFormData }: CompensationProps) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="space-y-2">
        <Label htmlFor="paymentDetails">Payment Details</Label>
        <Input
          id="paymentDetails"
          placeholder="e.g., $500 per post"
          value={formData.paymentDetails}
          onChange={(e) =>
            setFormData({ ...formData, paymentDetails: e.target.value })
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="compensationDetails">Additional Compensation</Label>
        <Textarea
          id="compensationDetails"
          placeholder="Describe any additional perks or compensation (e.g., free products, travel expenses)"
          className="min-h-[120px]"
          value={formData.compensationDetails}
          onChange={(e) =>
            setFormData({ ...formData, compensationDetails: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default Compensation;