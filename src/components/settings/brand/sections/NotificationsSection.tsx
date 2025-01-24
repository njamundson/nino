import { Bell } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationsSectionProps {
  brandData: any;
  isEditing: boolean;
  handleUpdateField: (field: string, value: any) => void;
}

const NotificationsSection = ({
  brandData,
  isEditing,
  handleUpdateField,
}: NotificationsSectionProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-nino-primary" />
        <h2 className="text-lg font-medium">Notifications</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>SMS Notifications</Label>
          <Switch
            checked={brandData.sms_notifications_enabled}
            onCheckedChange={(checked) => handleUpdateField("sms_notifications_enabled", checked)}
            disabled={!isEditing}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label>Email Notifications</Label>
          <Switch
            checked={brandData.email_notifications_enabled}
            onCheckedChange={(checked) => handleUpdateField("email_notifications_enabled", checked)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationsSection;