import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-nino-text">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="p-8 bg-white rounded-xl shadow-sm">
            <div className="text-nino-gray">
              <p>Profile settings coming soon</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="p-8 bg-white rounded-xl shadow-sm">
            <div className="text-nino-gray">
              <p>Account settings coming soon</p>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-8 bg-white rounded-xl shadow-sm">
            <div className="text-nino-gray">
              <p>Notification preferences coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;