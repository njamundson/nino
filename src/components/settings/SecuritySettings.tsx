import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SecuritySettingsProps {
  sms_notifications_enabled: boolean;
  two_factor_enabled: boolean;
  onUpdateField: (field: string, value: any) => void;
}

const SecuritySettings = ({
  sms_notifications_enabled,
  two_factor_enabled,
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
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Two Factor Authentication</Label>
          <p className="text-sm text-muted-foreground">
            Add an extra layer of security
          </p>
        </div>
        <Switch
          checked={two_factor_enabled}
          onCheckedChange={(checked) =>
            onUpdateField("two_factor_enabled", checked)
          }
        />
      </div>
    </div>
  );
};

export default SecuritySettings;