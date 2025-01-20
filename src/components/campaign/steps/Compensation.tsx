import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompensationProps {
  formData: any;
  setFormData: (data: any) => void;
}

const Compensation = ({ formData, setFormData }: CompensationProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <Label htmlFor="paymentDetails" className="text-sm font-medium text-gray-900">Payment Details</Label>
        <Input
          id="paymentDetails"
          placeholder="e.g., $500 per post"
          value={formData.paymentDetails}
          onChange={(e) =>
            setFormData({ ...formData, paymentDetails: e.target.value })
          }
          className="h-12 text-sm border-gray-200 focus:border-gray-300 focus:ring-gray-300"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="compensationDetails" className="text-sm font-medium text-gray-900">Additional Compensation</Label>
        <Textarea
          id="compensationDetails"
          placeholder="Describe any additional perks or compensation (e.g., free products, travel expenses)"
          className="min-h-[160px] text-sm leading-relaxed resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-300"
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