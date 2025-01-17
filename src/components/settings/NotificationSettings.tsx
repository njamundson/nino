import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, MessageSquare, Calendar, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NotificationSettings {
  push_enabled: boolean;
  email_enabled: boolean;
  message_notifications: boolean;
  application_updates: boolean;
  marketing_updates: boolean;
}

const defaultSettings: NotificationSettings = {
  push_enabled: true,
  email_enabled: true,
  message_notifications: true,
  application_updates: true,
  marketing_updates: true,
};

const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [brandId, setBrandId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: brandData, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (brandError) throw brandError;
        if (!brandData) return;

        setBrandId(brandData.id);

        const { data: notificationSettings, error: settingsError } = await supabase
          .from('brand_notification_settings')
          .select('*')
          .eq('brand_id', brandData.id)
          .maybeSingle();
        
        if (settingsError) throw settingsError;

        if (notificationSettings) {
          setSettings(notificationSettings);
        } else {
          // Create default settings
          const { data: newSettings, error: createError } = await supabase
            .from('brand_notification_settings')
            .insert([{ 
              brand_id: brandData.id,
              ...defaultSettings 
            }])
            .select()
            .single();
          
          if (createError) throw createError;
          if (newSettings) {
            setSettings(newSettings);
          }
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        toast({
          title: "Error",
          description: "Failed to load notification settings",
          variant: "destructive",
        });
      }
    };

    fetchBrandId();
  }, [toast]);

  const handleToggle = async (setting: keyof NotificationSettings) => {
    if (!brandId) return;

    try {
      const newSettings = { ...settings, [setting]: !settings[setting] };
      setSettings(newSettings);

      const { error } = await supabase
        .from('brand_notification_settings')
        .update(newSettings)
        .eq('brand_id', brandId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
      setSettings(settings); // Revert on error
    }
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
          <Switch 
            id="push-notifications" 
            checked={settings.push_enabled}
            onCheckedChange={() => handleToggle('push_enabled')} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
              <p className="text-sm text-nino-gray">Receive updates via email</p>
            </div>
          </div>
          <Switch 
            id="email-notifications" 
            checked={settings.email_enabled}
            onCheckedChange={() => handleToggle('email_enabled')} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="message-notifications" className="text-base">Message Notifications</Label>
              <p className="text-sm text-nino-gray">Get notified about new messages</p>
            </div>
          </div>
          <Switch 
            id="message-notifications" 
            checked={settings.message_notifications}
            onCheckedChange={() => handleToggle('message_notifications')} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="application-updates" className="text-base">Application Updates</Label>
              <p className="text-sm text-nino-gray">Get notified about new applications</p>
            </div>
          </div>
          <Switch 
            id="application-updates" 
            checked={settings.application_updates}
            onCheckedChange={() => handleToggle('application_updates')} 
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Star className="w-5 h-5 text-nino-primary" />
            <div>
              <Label htmlFor="marketing-updates" className="text-base">Marketing Updates</Label>
              <p className="text-sm text-nino-gray">Stay informed about new features</p>
            </div>
          </div>
          <Switch 
            id="marketing-updates" 
            checked={settings.marketing_updates}
            onCheckedChange={() => handleToggle('marketing_updates')} 
          />
        </div>
      </div>
    </Card>
  );
};

export default NotificationSettings;