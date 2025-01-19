import PageHeader from "@/components/shared/PageHeader";
import CreatorSettings from "@/components/settings/creator/CreatorSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountSettings from "@/components/settings/AccountSettings";

const Settings = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your creator profile and preferences"
      />
      
      <div className="space-y-6">
        <CreatorSettings />
        <NotificationSettings />
        <AccountSettings />
      </div>
    </div>
  );
};

export default Settings;