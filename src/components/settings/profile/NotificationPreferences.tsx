import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationPreferencesProps {
  brandData: {
    sms_notifications_enabled: boolean;
  };
  loading: boolean;
  onUpdateField: (field: string, value: boolean) => void;
}

const NotificationPreferences = ({ brandData, loading, onUpdateField }: NotificationPreferencesProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notification Preferences</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>SMS Notifications</Label>
            <p className="text-sm text-nino-gray">Receive notifications via text message</p>
          </div>
          <Switch
            checked={brandData.sms_notifications_enabled}
            onCheckedChange={(checked) => onUpdateField("sms_notifications_enabled", checked)}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;