import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, CreditCard } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import ProfileSettings from "@/components/settings/profile/CreatorProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SubscriptionSettings from "@/components/settings/SubscriptionSettings";

const Settings = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your creator profile, notifications, and subscription"
      />
      
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
          <TabsTrigger value="subscription" className="flex-1 data-[state=active]:bg-white">
            <CreditCard className="w-4 h-4 mr-2" />
            Subscription
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-8 space-y-8">
          <TabsContent value="profile" className="animate-fadeIn">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="notifications" className="animate-fadeIn">
            <NotificationSettings />
          </TabsContent>
          
          <TabsContent value="subscription" className="animate-fadeIn">
            <SubscriptionSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Settings;