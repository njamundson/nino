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
        <div>
          <h3 className="text-lg font-medium">SMS Notifications</h3>
          <p className="text-sm text-gray-500">
            Receive notifications via SMS for important updates
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
        <div>
          <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">
            Add an extra layer of security to your account
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