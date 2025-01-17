import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInformationFormProps {
  brandData: {
    email: string;
    support_email: string;
    phone_number: string;
    location: string;
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
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={brandData.email}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="support_email">Support Email</Label>
          <Input
            id="support_email"
            type="email"
            value={brandData.support_email}
            onChange={(e) => onUpdateField("support_email", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={brandData.phone_number}
            onChange={(e) => onUpdateField("phone_number", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={brandData.location}
            onChange={(e) => onUpdateField("location", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInformationForm;