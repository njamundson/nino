import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { SecuritySettingsProps } from "@/types/brand";

const SecuritySettings = ({
  sms_notifications_enabled,
  two_factor_enabled,
  onUpdateField
}: SecuritySettingsProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">SMS Notifications</h3>
            <p className="text-sm text-gray-500">
              Receive SMS notifications for important updates
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
    </Card>
  );
};

export default SecuritySettings;