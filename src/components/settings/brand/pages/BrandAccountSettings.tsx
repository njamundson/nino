import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useBrandSettings } from "@/hooks/useBrandSettings";

interface BrandAccountSettingsProps {
  onBack: () => void;
}

const BrandAccountSettings = ({ onBack }: BrandAccountSettingsProps) => {
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
        <h1 className="text-2xl font-semibold">Account & Security</h1>
      </div>

      <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-nino-gray">Add an extra layer of security</p>
            </div>
            <Switch
              checked={brandData.two_factor_enabled}
              onCheckedChange={(checked) => handleUpdateField("two_factor_enabled", checked)}
              disabled={loading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BrandAccountSettings;