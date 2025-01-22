import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SecuritySettingsProps {
  sms_notifications_enabled: boolean;
  onUpdateField: (field: string, value: any) => void;
}

const SecuritySettings = ({
  sms_notifications_enabled,
  onUpdateField,
}: SecuritySettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">SMS Notifications</Label>
          <p className="text-sm text-muted-foreground">
            Receive notifications via SMS
          </p>
        </div>
        <Switch
          checked={sms_notifications_enabled}
          onCheckedChange={(checked) =>
            onUpdateField("sms_notifications_enabled", checked)
          }
        />
      </div>
    </div>
  );
};

export default SecuritySettings;