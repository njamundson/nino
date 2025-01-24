import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBrandSettings } from "@/hooks/useBrandSettings";

interface BrandNotificationSettingsProps {
  onBack: () => void;
}

const BrandNotificationSettings = ({ onBack }: BrandNotificationSettingsProps) => {
  const { brandData, handleUpdateField, loading } = useBrandSettings();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-4"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Notification Settings</h1>
      </div>

      <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>SMS Notifications</Label>
              <p className="text-sm text-nino-gray">Receive campaign updates via text</p>
            </div>
            <Switch
              checked={brandData.sms_notifications_enabled}
              onCheckedChange={(checked) => handleUpdateField("sms_notifications_enabled", checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-nino-gray">Receive updates via email</p>
            </div>
            <Switch
              checked={brandData.email_notifications_enabled}
              onCheckedChange={(checked) => handleUpdateField("email_notifications_enabled", checked)}
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Application Updates</Label>
              <p className="text-sm text-nino-gray">Get notified about new creator applications</p>
            </div>
            <Switch
              checked={brandData.application_notifications_enabled}
              onCheckedChange={(checked) => handleUpdateField("application_notifications_enabled", checked)}
              disabled={loading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BrandNotificationSettings;