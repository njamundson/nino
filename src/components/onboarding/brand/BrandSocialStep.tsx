import { motion } from "framer-motion";
import { Instagram, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AccountManagersStep from "./AccountManagersStep";

interface AccountManager {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface BrandSocialStepProps {
  brandData: {
    instagram: string;
    website: string;
    [key: string]: string;
  };
  accountManagers: AccountManager[];
  onUpdateField: (field: string, value: string) => void;
  onUpdateManagers: (managers: AccountManager[]) => void;
}

const BrandSocialStep = ({
  brandData,
  accountManagers,
  onUpdateField,
  onUpdateManagers,
}: BrandSocialStepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Social & Contact</h1>
        <p className="text-nino-gray text-sm">Connect your social media and add team members</p>
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

        <AccountManagersStep
          accountManagers={accountManagers}
          onUpdateManagers={onUpdateManagers}
        />
      </div>
    </div>
  );
};

export default BrandSocialStep;