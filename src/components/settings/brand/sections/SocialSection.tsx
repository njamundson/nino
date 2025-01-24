import { Link } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialSectionProps {
  brandData: any;
  isEditing: boolean;
  handleUpdateField: (field: string, value: any) => void;
}

const SocialSection = ({
  brandData,
  isEditing,
  handleUpdateField,
}: SocialSectionProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <Link className="w-5 h-5 text-nino-primary" />
        <h2 className="text-lg font-medium">Social Links</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Website</Label>
          <Input
            value={brandData.website || ''}
            onChange={(e) => handleUpdateField("website", e.target.value)}
            disabled={!isEditing}
            className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
          />
        </div>
        <div className="space-y-2">
          <Label>Instagram</Label>
          <Input
            value={brandData.instagram || ''}
            onChange={(e) => handleUpdateField("instagram", e.target.value)}
            disabled={!isEditing}
            className="bg-nino-bg border-0 focus:ring-2 focus:ring-nino-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default SocialSection;