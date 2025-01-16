import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import { User, Bell, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-nino-text">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white/50 backdrop-blur-xl w-full justify-start space-x-2 h-12 p-1">
          <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 data-[state=active]:bg-white">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="account" className="flex-1 data-[state=active]:bg-white">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Account
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8 space-y-8">
          <TabsContent value="profile" className="animate-fadeIn">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="animate-fadeIn">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="account" className="animate-fadeIn">
            <AccountSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;