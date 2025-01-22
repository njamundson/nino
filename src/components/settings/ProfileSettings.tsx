import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import SecuritySettings from "./SecuritySettings";
import { useBrandSettings } from "@/hooks/useBrandSettings";

interface ProfileSettingsProps {
  onBack?: () => void;
}

const ProfileSettings = ({ onBack }: ProfileSettingsProps) => {
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
      
      <h2 className="text-2xl font-semibold mb-8">Profile Settings</h2>
      
      <div className="space-y-8">
        <SecuritySettings
          sms_notifications_enabled={brandData?.sms_notifications_enabled || false}
          onUpdateField={handleUpdateField}
        />
      </div>
    </div>
  );
};

export default ProfileSettings;