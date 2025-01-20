import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandProfileForm from "@/components/settings/profile/BrandProfileForm";
import AccountManagersSection from "@/components/settings/profile/AccountManagersSection";
import { useBrandSettings } from "@/hooks/useBrandSettings";

const BrandSettings = () => {
  const {
    loading,
    profileImage,
    brandData,
    setProfileImage,
    setBrandData,
    handleSave,
  } = useBrandSettings();

  return (
    <div className="container max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Brand Settings</h1>
        <p className="text-gray-500">Manage your brand profile and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="p-6">
            <BrandProfileForm 
              loading={loading}
              profileImage={profileImage}
              brandData={brandData}
              onUpdateField={(field, value) => setBrandData(prev => ({ ...prev, [field]: value }))}
              onUpdateImage={setProfileImage}
            />
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <AccountManagersSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandSettings;