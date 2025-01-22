import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandProfileForm from "./profile/BrandProfileForm";
import NotificationSettings from "./NotificationSettings";
import SecuritySettings from "./SecuritySettings";
import { useBrandSettings } from "@/hooks/useBrandSettings";

const ProfileSettings = () => {
  const {
    brandData,
    setBrandData,
    profileImage,
    setProfileImage,
    loading,
    handleSave,
    updateBrandSettings
  } = useBrandSettings();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await handleSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <BrandProfileForm
              loading={loading}
              brandData={brandData}
              profileImage={profileImage}
              onUpdateImage={setProfileImage}
              onUpdateField={(field, value) => setBrandData(prev => ({ ...prev, [field]: value }))}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings
              sms_notifications_enabled={brandData.sms_notifications_enabled || false}
              onUpdateField={(field, value) => setBrandData(prev => ({ ...prev, [field]: value }))}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings
              two_factor_enabled={brandData.two_factor_enabled || false}
              onUpdateField={(field, value) => setBrandData(prev => ({ ...prev, [field]: value }))}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </form>
  );
};

export default ProfileSettings;