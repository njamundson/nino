import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BrandData } from "@/types/brand";

interface BrandDetailsStepProps {
  brandData: BrandData;
  onUpdateField: (field: keyof BrandData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BrandDetailsStep = ({
  brandData,
  onUpdateField,
  onNext,
  onBack,
}: BrandDetailsStepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Brand Details</h1>
        <p className="text-nino-gray text-sm">Tell us more about your brand</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="homeLocation" className="text-base">Home Location</Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-nino-gray" />
            <Input
              id="homeLocation"
              placeholder="Where is your brand based?"
              value={brandData.homeLocation}
              className="pl-12 h-12 text-base bg-nino-bg border-transparent focus:border-nino-primary"
              onChange={(e) => onUpdateField("homeLocation", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandBio" className="text-base">Brand Bio</Label>
          <Textarea
            id="brandBio"
            placeholder="Tell us about your brand..."
            value={brandData.brandBio}
            className="min-h-[120px] text-base bg-nino-bg border-transparent focus:border-nino-primary resize-none"
            onChange={(e) => onUpdateField("brandBio", e.target.value)}
          />
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

export default BrandDetailsStep;