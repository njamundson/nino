import { motion } from "framer-motion";
import { Instagram, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandData } from "@/types/brand";

interface BrandSocialStepProps {
  brandData: BrandData;
  onUpdateField: (field: keyof BrandData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BrandSocialStep = ({
  brandData,
  onUpdateField,
  onNext,
  onBack,
}: BrandSocialStepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Social & Contact</h1>
        <p className="text-nino-gray text-sm">Connect your social media accounts</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="instagram" className="text-base">Instagram</Label>
          <div className="relative">
            <Instagram className="absolute left-4 top-3.5 w-5 h-5 text-nino-gray" />
            <Input
              id="instagram"
              placeholder="Instagram handle"
              value={brandData.instagram}
              className="pl-12 h-12 text-base bg-nino-bg border-transparent focus:border-nino-primary"
              onChange={(e) => onUpdateField("instagram", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website" className="text-base">Website</Label>
          <div className="relative">
            <Globe className="absolute left-4 top-3.5 w-5 h-5 text-nino-gray" />
            <Input
              id="website"
              placeholder="Website URL"
              value={brandData.website}
              className="pl-12 h-12 text-base bg-nino-bg border-transparent focus:border-nino-primary"
              onChange={(e) => onUpdateField("website", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="text-nino-gray hover:text-nino-text px-8 py-3 rounded-lg transition-colors"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="bg-nino-primary text-white px-8 py-3 rounded-lg hover:bg-nino-primary/90 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandSocialStep;