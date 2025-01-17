import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface SecuritySettingsProps {
  brandData: {
    two_factor_enabled: boolean;
  };
  loading: boolean;
  loginHistory: any[];
  onUpdateField: (field: string, value: boolean) => void;
}

const SecuritySettings = ({ brandData, loading, loginHistory, onUpdateField }: SecuritySettingsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Security Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-nino-gray">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={brandData.two_factor_enabled}
            onCheckedChange={(checked) => onUpdateField("two_factor_enabled", checked)}
            disabled={loading}
          />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label>Recent Login Activity</Label>
        <div className="space-y-2">
          {loginHistory.map((login) => (
            <div key={login.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">{new Date(login.login_timestamp).toLocaleDateString()}</p>
                <p className="text-xs text-nino-gray">{login.ip_address}</p>
              </div>
              <div className="text-xs text-nino-gray">{login.device_info}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;