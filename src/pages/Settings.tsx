import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountSettings from "@/components/settings/AccountSettings";

const Settings = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-nino-text">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-xl w-full justify-start space-x-2 h-12 p-1">
          <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-white">
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 data-[state=active]:bg-white">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="flex-1 data-[state=active]:bg-white">
            Account
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8 space-y-8">
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;