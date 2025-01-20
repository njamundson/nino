import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BrandProfileForm from "./profile/BrandProfileForm";
import ContactInformationForm from "./profile/ContactInformationForm";
import SecuritySettings from "./profile/SecuritySettings";
import NotificationPreferences from "./profile/NotificationPreferences";
import AccountManagersSection from "./profile/AccountManagersSection";

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
    <div className="container max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Brand Settings</h1>
        <p className="text-gray-500">Manage your brand profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <BrandProfileForm 
              loading={loading}
              profileImage={profileImage}
              brandData={brandData}
              onUpdateField={handleUpdateField}
              onUpdateImage={setProfileImage}
            />
          </Card>

          <Card className="p-6">
            <ContactInformationForm 
              brandData={brandData}
              loading={loading}
              onUpdateField={handleUpdateField}
            />
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <AccountManagersSection />
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <NotificationPreferences 
              brandData={brandData}
              loading={loading}
              onUpdateField={handleUpdateField}
            />
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <SecuritySettings 
              brandData={brandData}
              loading={loading}
              loginHistory={loginHistory}
              onUpdateField={handleUpdateField}
            />
          </Card>
        </TabsContent>
      </Tabs>

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
  );
};

export default ProfileSettings;