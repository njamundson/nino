import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CompensationProps {
  formData: any;
  setFormData: (data: any) => void;
}

const Compensation = ({ formData, setFormData }: CompensationProps) => {
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '');
    
    // Allow empty input or valid numbers
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)) {
      setFormData({ ...formData, paymentDetails: value ? `$${value}` : '$0' });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <Label htmlFor="paymentDetails" className="text-sm font-medium text-gray-700">Payment Details</Label>
        <Input
          id="paymentDetails"
          placeholder="$0 – Set your own terms: payment, trade, or compensation"
          value={formData.paymentDetails.startsWith('$') ? formData.paymentDetails : `$${formData.paymentDetails}`}
          onChange={handlePaymentChange}
          className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="compensationDetails" className="text-sm font-medium text-gray-700">Additional Compensation</Label>
        <Textarea
          id="compensationDetails"
          placeholder="Describe any additional perks or compensation (e.g., free products, travel expenses)"
          className="min-h-[160px] text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 resize-none placeholder:text-gray-400 leading-relaxed"
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