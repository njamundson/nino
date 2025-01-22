import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useBrandSettings } from "@/hooks/useBrandSettings";

interface NotificationSettingsProps {
  onBack?: () => void;
}

const NotificationSettings = ({ onBack }: NotificationSettingsProps) => {
  const { brandData, loading, handleUpdateField } = useBrandSettings();

  return (
    <div className="max-w-2xl mx-auto pt-12 px-6">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
      )}
      
      <h2 className="text-2xl font-semibold mb-8">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-nino-gray">Receive updates via email</p>
            </div>
            <Switch
              checked={brandData?.email_notifications_enabled || false}
              onCheckedChange={(checked) => handleUpdateField("email_notifications_enabled", checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-nino-gray">Receive updates via text message</p>
            </div>
            <Switch
              checked={brandData?.sms_notifications_enabled || false}
              onCheckedChange={(checked) => handleUpdateField("sms_notifications_enabled", checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-nino-gray">Receive push notifications on your devices</p>
            </div>
            <Switch
              checked={brandData?.push_notifications_enabled || false}
              onCheckedChange={(checked) => handleUpdateField("push_notifications_enabled", checked)}
              disabled={loading}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-lg font-medium mb-4">Notification Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Applications</Label>
                <p className="text-sm text-nino-gray">When creators apply to your campaigns</p>
              </div>
              <Switch
                checked={brandData?.application_notifications_enabled || false}
                onCheckedChange={(checked) => handleUpdateField("application_notifications_enabled", checked)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Messages</Label>
                <p className="text-sm text-nino-gray">When you receive new messages</p>
              </div>
              <Switch
                checked={brandData?.message_notifications_enabled || false}
                onCheckedChange={(checked) => handleUpdateField("message_notifications_enabled", checked)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Updates</Label>
                <p className="text-sm text-nino-gray">News and updates about our platform</p>
              </div>
              <Switch
                checked={brandData?.marketing_notifications_enabled || false}
                onCheckedChange={(checked) => handleUpdateField("marketing_notifications_enabled", checked)}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;