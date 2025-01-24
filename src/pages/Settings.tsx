import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, UserRound, Upload } from "lucide-react";
import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import CreatorProfileForm from "@/components/settings/creator/CreatorProfileForm";
import ProfileImageSection from "@/components/settings/profile/ProfileImageSection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Settings = () => {
  const {
    loading,
    profileImage,
    creatorData,
    setProfileImage,
    setCreatorData,
    handleSave,
  } = useCreatorSettings();

  const handleUpdateField = (field: string, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-medium text-[#222222]">Settings</h1>
            <p className="text-[#8E9196] mt-2">Manage your account settings and preferences</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white px-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
            style={{ background: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)" }}
          >
            <div className="relative">
              <UserRound className="absolute top-0 right-0 w-6 h-6 text-[#403E43]" />
              <h2 className="text-xl font-semibold mb-6 text-[#222222]">Profile</h2>
              <ProfileImageSection 
                profileImage={profileImage} 
                setProfileImage={setProfileImage}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
            style={{ background: "linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)" }}
          >
            <div className="relative">
              <SettingsIcon className="absolute top-0 right-0 w-6 h-6 text-[#403E43]" />
              <h2 className="text-xl font-semibold mb-6 text-[#222222]">Account</h2>
              <CreatorProfileForm
                loading={loading}
                creatorData={creatorData}
                onUpdateField={handleUpdateField}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;