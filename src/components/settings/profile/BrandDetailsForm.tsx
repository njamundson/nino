import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BrandDetailsFormProps {
  brandData: {
    company_name: string;
    description: string;
    website: string;
    instagram: string;
  };
  loading: boolean;
  onUpdateField: (field: string, value: string) => void;
}

const BrandDetailsForm = ({ brandData, loading, onUpdateField }: BrandDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="company_name">Brand Name</Label>
        <Input
          id="company_name"
          value={brandData.company_name}
          onChange={(e) => onUpdateField("company_name", e.target.value)}
          disabled={loading}
          className="bg-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Brand Description</Label>
        <Textarea
          id="description"
          value={brandData.description}
          onChange={(e) => onUpdateField("description", e.target.value)}
          disabled={loading}
          className="bg-white/50 min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={brandData.website}
            onChange={(e) => onUpdateField("website", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Input
            id="instagram"
            value={brandData.instagram}
            onChange={(e) => onUpdateField("instagram", e.target.value)}
            disabled={loading}
            className="bg-white/50"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandDetailsForm;