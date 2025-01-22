import { BrandSettings } from "@/types/brand";
import SecuritySettings from "./SecuritySettings";

interface ProfileSettingsProps {
  brandData: BrandSettings;
  onUpdateField: (field: string, value: any) => void;
}

const ProfileSettings = ({ brandData, onUpdateField }: ProfileSettingsProps) => {
  return (
    <div className="space-y-8">
      <SecuritySettings
        two_factor_enabled={brandData.two_factor_enabled || false}
        sms_notifications_enabled={brandData.sms_notifications_enabled || false}
        onUpdateField={onUpdateField}
      />
    </div>
  );
};

export default ProfileSettings;