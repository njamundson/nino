import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare } from "lucide-react";

const NotificationSettings = () => {
  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
      <h3 className="text-xl font-semibold text-nino-text mb-6">Notifications</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-nino-primary" />
            <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
          </div>
          <Switch id="push-notifications" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-nino-primary" />
            <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
          </div>
          <Switch id="email-notifications" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-nino-primary" />
            <Label htmlFor="message-notifications" className="text-base">Message Notifications</Label>
          </div>
          <Switch id="message-notifications" />
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;