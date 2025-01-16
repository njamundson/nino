import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare, Globe, Calendar, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();

  const handleToggle = (setting: string) => {
    toast({
      title: "Notification settings updated",
      description: `${setting} notifications have been updated.`,
    });
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
      <h3 className="text-xl font-semibold text-nino-text mb-6">Notifications</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
              <p className="text-sm text-nino-gray">Receive notifications on your device</p>
            </div>
          </div>
          <Switch id="push-notifications" onCheckedChange={() => handleToggle("Push")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-nino-gray">Receive updates via email</p>
            </div>
          </div>
          <Switch id="email-notifications" onCheckedChange={() => handleToggle("Email")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="message-notifications" className="text-base">Message Notifications</Label>
              <p className="text-sm text-nino-gray">Get notified about new messages</p>
            </div>
          </div>
          <Switch id="message-notifications" onCheckedChange={() => handleToggle("Message")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="reminder-notifications" className="text-base">Reminder Notifications</Label>
              <p className="text-sm text-nino-gray">Get reminded about important events</p>
            </div>
          </div>
          <Switch id="reminder-notifications" onCheckedChange={() => handleToggle("Reminder")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="updates-notifications" className="text-base">Product Updates</Label>
              <p className="text-sm text-nino-gray">Stay informed about new features</p>
            </div>
          </div>
          <Switch id="updates-notifications" onCheckedChange={() => handleToggle("Updates")} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="marketing-notifications" className="text-base">Marketing Communications</Label>
              <p className="text-sm text-nino-gray">Receive promotional content and offers</p>
            </div>
          </div>
          <Switch id="marketing-notifications" onCheckedChange={() => handleToggle("Marketing")} />
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;