import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandSettings } from "@/types/brand";

interface BrandProfileFormProps {
  loading: boolean;
  brandData: BrandSettings;
  onUpdateField: (field: string, value: any) => void;
}

const BrandProfileForm = ({
  loading,
  brandData,
  onUpdateField,
}: BrandProfileFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company_name">Brand Name</Label>
        <Input
          id="company_name"
          value={brandData.company_name}
          onChange={(e) => onUpdateField("company_name", e.target.value)}
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl"
          placeholder="Enter your brand name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Brand Description</Label>
        <Textarea
          id="description"
          value={brandData.description}
          onChange={(e) => onUpdateField("description", e.target.value)}
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl resize-none h-32"
          placeholder="Tell us about your brand..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={brandData.location}
          onChange={(e) => onUpdateField("location", e.target.value)}
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl"
          placeholder="e.g., New York, NY"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram</Label>
        <Input
          id="instagram"
          value={brandData.instagram}
          onChange={(e) => onUpdateField("instagram", e.target.value)}
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl"
          placeholder="@yourbrand"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={brandData.website}
          onChange={(e) => onUpdateField("website", e.target.value)}
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl"
          placeholder="https://yourbrand.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="support_email">Support Email</Label>
        <Input
          id="support_email"
          value={brandData.support_email}
          onChange={(e) => onUpdateField("support_email", e.target.value)}
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl"
          placeholder="support@yourbrand.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
          id="phone_number"
          value={brandData.phone_number}
          onChange={(e) => onUpdateField("phone_number", e.target.value)}
          disabled={loading}
          className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl"
          placeholder="+1 (555) 123-4567"
        />
      </div>
    </div>
  );
};

export default BrandProfileForm;