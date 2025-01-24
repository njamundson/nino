import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactSectionProps {
  brandData: any;
  isEditing: boolean;
  handleUpdateField: (field: string, value: any) => void;
}

const ContactSection = ({
  brandData,
  isEditing,
  handleUpdateField,
}: ContactSectionProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <Mail className="w-5 h-5 text-nino-primary" />
        <h2 className="text-lg font-medium">Contact Information</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Support Email</Label>
          <Input
            value={brandData.support_email || ''}
            onChange={(e) => handleUpdateField("support_email", e.target.value)}
            disabled={!isEditing}
            className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
          />
        </div>
        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            value={brandData.phone_number || ''}
            onChange={(e) => handleUpdateField("phone_number", e.target.value)}
            disabled={!isEditing}
            className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
          />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            value={brandData.location || ''}
            onChange={(e) => handleUpdateField("location", e.target.value)}
            disabled={!isEditing}
            className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactSection;