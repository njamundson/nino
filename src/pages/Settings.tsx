import { Settings2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import ProfileSettings from "@/components/settings/profile/CreatorProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountSettings from "@/components/settings/AccountSettings";

const Settings = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings2 className="w-8 h-8 text-nino-primary" />
        <PageHeader
          title="Settings"
          description="Manage your brand profile and preferences"
        />
      </div>
      
      <div className="space-y-6">
        <ProfileSettings />
        <NotificationSettings />
        <AccountSettings />
      </div>
    </div>
  );
};

export default Settings;