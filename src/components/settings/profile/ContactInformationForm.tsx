import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInformationFormProps {
  brandData: {
    location: string;
    phone_number: string;
    support_email: string;
  };
  loading: boolean;
  onUpdateField: (field: string, value: string) => void;
}

const ContactInformationForm = ({ brandData, loading, onUpdateField }: ContactInformationFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={brandData.location}
            onChange={(e) => onUpdateField("location", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="e.g., New York, NY"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            type="tel"
            value={brandData.phone_number}
            onChange={(e) => onUpdateField("phone_number", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="support_email">Support Email</Label>
          <Input
            id="support_email"
            type="email"
            value={brandData.support_email}
            onChange={(e) => onUpdateField("support_email", e.target.value)}
            disabled={loading}
            className="bg-white/50"
            placeholder="support@yourbrand.com"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInformationForm;