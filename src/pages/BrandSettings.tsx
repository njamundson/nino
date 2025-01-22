import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSettings from "@/components/settings/ProfileSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import SubscriptionSettings from "@/components/settings/SubscriptionSettings";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import PageHeader from "@/components/shared/PageHeader";

interface BrandSettingsProps {
  loading?: boolean;
  brandData?: any;
  onUpdateField?: (field: string, value: any) => void;
}

const BrandSettings = ({ loading = false, brandData = {}, onUpdateField }: BrandSettingsProps) => {
  return (
    <div className="container max-w-7xl mx-auto py-8">
      <PageHeader
        title="Settings"
        description="Manage your brand settings and preferences"
      />
      
      <div className="space-y-6">
        <ProfileSettings />
        <AccountSettings />
        <SubscriptionSettings />
      </div>
    </div>
  );
};

export default BrandSettings;