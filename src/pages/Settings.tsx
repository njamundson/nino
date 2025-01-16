import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Moon, User, Globe, Shield } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#333333]">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-white mb-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="p-6 bg-white rounded-xl shadow-sm space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-[#F1F1F1] rounded-lg">
              <User className="w-5 h-5 text-[#8E9196]" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#333333]">Personal Information</h3>
                <p className="text-sm text-[#8E9196]">Update your profile details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-[#F1F1F1] rounded-lg">
              <Globe className="w-5 h-5 text-[#8E9196]" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-[#333333]">Language</h3>
                <p className="text-sm text-[#8E9196]">Choose your preferred language</p>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="p-6 bg-white rounded-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div className="flex items-center space-x-4">
                <Bell className="w-5 h-5 text-[#8E9196]" />
                <div>
                  <h3 className="text-sm font-medium text-[#333333]">Push Notifications</h3>
                  <p className="text-sm text-[#8E9196]">Get notified about new messages</p>
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div className="flex items-center space-x-4">
                <Bell className="w-5 h-5 text-[#8E9196]" />
                <div>
                  <h3 className="text-sm font-medium text-[#333333]">Email Notifications</h3>
                  <p className="text-sm text-[#8E9196]">Receive email updates</p>
                </div>
              </div>
              <Switch />
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card className="p-6 bg-white rounded-xl shadow-sm space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div className="flex items-center space-x-4">
                <Moon className="w-5 h-5 text-[#8E9196]" />
                <div>
                  <h3 className="text-sm font-medium text-[#333333]">Dark Mode</h3>
                  <p className="text-sm text-[#8E9196]">Toggle dark mode on/off</p>
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-[#F1F1F1] rounded-lg">
              <div className="flex items-center space-x-4">
                <Shield className="w-5 h-5 text-[#8E9196]" />
                <div>
                  <h3 className="text-sm font-medium text-[#333333]">Privacy Mode</h3>
                  <p className="text-sm text-[#8E9196]">Enhanced privacy settings</p>
                </div>
              </div>
              <Switch />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;