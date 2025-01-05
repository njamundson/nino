import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Globe } from "lucide-react";

interface SocialLinksStepProps {
  instagram: string;
  website: string;
  onUpdateField: (field: string, value: string) => void;
}

const SocialLinksStep = ({
  instagram,
  website,
  onUpdateField,
}: SocialLinksStepProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label>Social Links</Label>
        <div className="space-y-4">
          <div className="relative">
            <Instagram className="absolute left-3 top-3 w-5 h-5 text-nino-gray" />
            <Input
              value={instagram}
              onChange={(e) => onUpdateField("instagram", e.target.value)}
              placeholder="Instagram username"
              className="pl-10 bg-nino-bg border-transparent focus:border-nino-primary"
            />
          </div>
          <div className="relative">
            <Globe className="absolute left-3 top-3 w-5 h-5 text-nino-gray" />
            <Input
              value={website}
              onChange={(e) => onUpdateField("website", e.target.value)}
              placeholder="Website URL"
              className="pl-10 bg-nino-bg border-transparent focus:border-nino-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksStep;