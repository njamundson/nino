import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { FormEvent } from "react";

import BrandProfileForm from "./profile/BrandProfileForm";
import ContactInformationForm from "./profile/ContactInformationForm";
import SecuritySettings from "./profile/SecuritySettings";
import NotificationPreferences from "./profile/NotificationPreferences";

const ProfileSettings = () => {
  const {
    loading,
    brandData,
    updateBrandSettings,
  } = useBrandSettings();

  const handleUpdateField = (field: string, value: any) => {
    updateBrandSettings.mutate({ [field]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    await updateBrandSettings.mutateAsync(Object.fromEntries(formData));
  };

  return (
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <BrandProfileForm 
          loading={loading}
          brandData={brandData}
          onUpdateField={handleUpdateField}
        />

        <ContactInformationForm 
          brandData={brandData}
          loading={loading}
          onUpdateField={handleUpdateField}
        />

        <NotificationPreferences 
          brandData={brandData}
          loading={loading}
          onUpdateField={handleUpdateField}
        />

        <SecuritySettings 
          brandData={brandData}
          loading={loading}
          onUpdateField={handleUpdateField}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || updateBrandSettings.isPending}
            className="bg-nino-primary hover:bg-nino-primary/90"
          >
            {(loading || updateBrandSettings.isPending) ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileSettings;