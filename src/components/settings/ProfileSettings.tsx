import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useBrandSettings } from "@/hooks/useBrandSettings";

import BrandProfileForm from "./profile/BrandProfileForm";
import ContactInformationForm from "./profile/ContactInformationForm";
import SecuritySettings from "./profile/SecuritySettings";
import NotificationPreferences from "./profile/NotificationPreferences";

const ProfileSettings = () => {
  const {
    loading,
    profileImage,
    brandData,
    loginHistory,
    setProfileImage,
    setBrandData,
    handleSave,
  } = useBrandSettings();

  const handleUpdateField = (field: string, value: any) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-8">
      <div className="space-y-6">
        <BrandProfileForm 
          loading={loading}
          profileImage={profileImage}
          brandData={brandData}
          onUpdateField={handleUpdateField}
          onUpdateImage={setProfileImage}
        />

        <ContactInformationForm 
          brandData={brandData}
          loading={loading}
          onUpdateField={handleUpdateField}
        />

        <NotificationPreferences 
          brandData={brandData}
          loading={loading}
          onUpdateField={handleUpdateField}
        />

        <SecuritySettings 
          brandData={brandData}
          loading={loading}
          loginHistory={loginHistory}
          onUpdateField={handleUpdateField}
        />

        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-nino-primary hover:bg-nino-primary/90"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileSettings;