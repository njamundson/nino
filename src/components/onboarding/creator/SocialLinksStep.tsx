import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Globe } from "lucide-react";
import { formatWebsiteUrl } from "@/utils/socialMediaUtils";

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
  const handleWebsiteChange = (value: string) => {
    onUpdateField("website", value);
  };

  const handleWebsiteBlur = () => {
    if (website) {
      const formattedUrl = formatWebsiteUrl(website);
      if (formattedUrl) {
        onUpdateField("website", formattedUrl);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Social Links</h1>
        <p className="text-nino-gray text-sm">Connect your online presence</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base flex items-center gap-1">
              Instagram
              <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Instagram className="absolute left-4 top-3.5 w-5 h-5 text-nino-gray" />
              <Input
                value={instagram}
                onChange={(e) => onUpdateField("instagram", e.target.value)}
                placeholder="Instagram username"
                className="pl-12 bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-base">Website (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-4 top-3.5 w-5 h-5 text-nino-gray" />
              <Input
                value={website}
                onChange={(e) => handleWebsiteChange(e.target.value)}
                onBlur={handleWebsiteBlur}
                placeholder="Website URL"
                className="pl-12 bg-nino-bg border-transparent focus:border-nino-primary h-12 text-base"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksStep;