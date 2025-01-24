import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useBrandSettings } from "@/hooks/useBrandSettings";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import BrandProfileSection from "@/components/settings/brand/sections/BrandProfileSection";
import ContactSection from "@/components/settings/brand/sections/ContactSection";
import SocialSection from "@/components/settings/brand/sections/SocialSection";
import NotificationsSection from "@/components/settings/brand/sections/NotificationsSection";
import BrandManagersSettings from "@/components/settings/brand/pages/BrandManagersSettings";

const BrandSettings = () => {
  const {
    loading,
    profileImage,
    brandData,
    setProfileImage,
    handleUpdateField,
    handleSave,
  } = useBrandSettings();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const onSave = async () => {
    const formData = new FormData();
    Object.entries(brandData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    await handleSave(formData);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Settings updated successfully",
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Settings"
            description="Manage your brand settings and preferences"
          />
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-nino-primary hover:bg-nino-primary/90 text-white"
          >
            {isEditing ? 'Cancel' : 'Edit Settings'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <BrandProfileSection
              profileImage={profileImage}
              brandData={brandData}
              isEditing={isEditing}
              handleUpdateField={handleUpdateField}
              setProfileImage={setProfileImage}
            />
          </div>
          
          <ContactSection
            brandData={brandData}
            isEditing={isEditing}
            handleUpdateField={handleUpdateField}
          />
          
          <SocialSection
            brandData={brandData}
            isEditing={isEditing}
            handleUpdateField={handleUpdateField}
          />
          
          <NotificationsSection
            brandData={brandData}
            isEditing={isEditing}
            handleUpdateField={handleUpdateField}
          />

          <div className="md:col-span-2">
            <BrandManagersSettings />
          </div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8"
            >
              Save Changes
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BrandSettings;