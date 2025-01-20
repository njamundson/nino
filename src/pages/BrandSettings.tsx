import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BrandProfileForm from "@/components/settings/profile/BrandProfileForm";
import ContactInformationForm from "@/components/settings/profile/ContactInformationForm";
import NotificationPreferences from "@/components/settings/profile/NotificationPreferences";
import SecuritySettings from "@/components/settings/profile/SecuritySettings";
import { useBrandSettings } from "@/hooks/useBrandSettings";

const BrandSettings = () => {
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
    <div className="container max-w-4xl py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your brand profile and preferences
        </p>
      </div>

      <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-8">
        <div className="space-y-6">
          <BrandProfileForm 
            loading={loading}
            profileImage={profileImage}
            brandData={brandData}
            onUpdateField={handleUpdateField}
            onUpdateImage={setProfileImage}
          />

          <Separator />

          <ContactInformationForm 
            brandData={brandData}
            loading={loading}
            onUpdateField={handleUpdateField}
          />

          <Separator />

          <NotificationPreferences 
            brandData={brandData}
            loading={loading}
            onUpdateField={handleUpdateField}
          />

          <Separator />

          <SecuritySettings 
            brandData={brandData}
            loading={loading}
            loginHistory={loginHistory}
            onUpdateField={handleUpdateField}
          />
        </div>
      </Card>
    </div>
  );
};

export default BrandSettings;