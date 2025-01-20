import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface CompensationProps {
  formData: {
    payment_details: string;
    compensation_details: string;
  };
  setFormData: (data: any) => void;
}

const Compensation = ({ formData, setFormData }: CompensationProps) => {
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove the $ symbol if present
    if (value.startsWith('$')) {
      value = value.substring(1);
    }
    
    // Allow empty input or numbers (including decimal points)
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData({ 
        ...formData, 
        payment_details: value === '' ? '' : `$${value}`
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="space-y-4">
        <Label htmlFor="payment_details" className="text-sm font-medium text-gray-700">Payment Details</Label>
        <Input
          id="payment_details"
          placeholder="$0 – Set your own terms: payment, trade, or compensation"
          value={formData.payment_details}
          onChange={handlePaymentChange}
          className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 placeholder:text-gray-400"
        />
      </div>

      <div className="space-y-4">
        <Label htmlFor="compensation_details" className="text-sm font-medium text-gray-700">Additional Compensation</Label>
        <Textarea
          id="compensation_details"
          placeholder="Describe any additional perks or compensation (e.g., free products, travel expenses)"
          className="min-h-[160px] text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 resize-none placeholder:text-gray-400 leading-relaxed"
          value={formData.compensation_details}
          onChange={(e) =>
            setFormData({ ...formData, compensation_details: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default Compensation;