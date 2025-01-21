import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  message_notifications: boolean;
  application_updates: boolean;
  marketing_updates: boolean;
}

const NotificationSettings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    push_enabled: true,
    email_enabled: true,
    message_notifications: true,
    application_updates: true,
    marketing_updates: false,
  });

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (brand) {
        const { data: notificationSettings } = await supabase
          .from('brand_notification_settings')
          .select('*')
          .eq('brand_id', brand.id)
          .single();

        if (notificationSettings) {
          setSettings({
            push_enabled: notificationSettings.push_enabled,
            email_enabled: notificationSettings.email_enabled,
            message_notifications: notificationSettings.message_notifications,
            application_updates: notificationSettings.application_updates,
            marketing_updates: notificationSettings.marketing_updates,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const handleToggle = async (field: keyof NotificationSettings, value: boolean) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (brand) {
        const { error } = await supabase
          .from('brand_notification_settings')
          .upsert({
            brand_id: brand.id,
            [field]: value,
          });

        if (error) throw error;

        setSettings(prev => ({ ...prev, [field]: value }));
        toast({
          title: "Success",
          description: "Notification settings updated",
        });
      }
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-nino-primary" />
        <h3 className="text-xl font-semibold text-nino-text">Notifications</h3>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Push Notifications</Label>
            <p className="text-sm text-nino-gray">Receive notifications on your device</p>
          </div>
          <Switch
            checked={settings.push_enabled}
            onCheckedChange={(checked) => handleToggle('push_enabled', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-nino-gray">Receive updates via email</p>
          </div>
          <Switch
            checked={settings.email_enabled}
            onCheckedChange={(checked) => handleToggle('email_enabled', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Message Notifications</Label>
            <p className="text-sm text-nino-gray">Get notified about new messages</p>
          </div>
          <Switch
            checked={settings.message_notifications}
            onCheckedChange={(checked) => handleToggle('message_notifications', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Application Updates</Label>
            <p className="text-sm text-nino-gray">Get notified about application status changes</p>
          </div>
          <Switch
            checked={settings.application_updates}
            onCheckedChange={(checked) => handleToggle('application_updates', checked)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Marketing Updates</Label>
            <p className="text-sm text-nino-gray">Receive marketing and promotional emails</p>
          </div>
          <Switch
            checked={settings.marketing_updates}
            onCheckedChange={(checked) => handleToggle('marketing_updates', checked)}
            disabled={loading}
          />
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;