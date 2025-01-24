import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  UserRound, 
  CreditCard, 
  Mail,
  Camera
} from "lucide-react";
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

  const settingsBubbles = [
    {
      title: "Profile",
      icon: <UserRound className="w-6 h-6" />,
      gradient: "linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)",
      content: (
        <div className="space-y-4">
          <ProfileImageSection 
            profileImage={profileImage} 
            setProfileImage={setProfileImage}
          />
          <CreatorProfileForm
            loading={loading}
            creatorData={creatorData}
            onUpdateField={handleUpdateField}
          />
        </div>
      )
    },
    {
      title: "Account",
      icon: <SettingsIcon className="w-6 h-6" />,
      gradient: "linear-gradient(to top, #accbee 0%, #e7f0fd 100%)",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account Settings</h3>
          <p className="text-sm text-gray-600">Manage your account preferences and settings</p>
        </div>
      )
    },
    {
      title: "Subscription",
      icon: <CreditCard className="w-6 h-6" />,
      gradient: "linear-gradient(to right, #ffc3a0 0%, #ffafbd 100%)",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Subscription Details</h3>
          <p className="text-sm text-gray-600">View and manage your subscription</p>
        </div>
      )
    },
    {
      title: "Notifications",
      icon: <Mail className="w-6 h-6" />,
      gradient: "linear-gradient(to top, #d299c2 0%, #fef9d7 100%)",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <p className="text-sm text-gray-600">Customize your notification settings</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F0FB] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-medium text-[#1A1F2C]">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsBubbles.map((bubble, index) => (
            <motion.div
              key={bubble.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl shadow-lg"
              style={{ background: bubble.gradient }}
            >
              <div className="absolute top-4 right-4">
                {bubble.icon}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{bubble.title}</h2>
                {bubble.content}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-4 border-t border-gray-200">
          <div className="max-w-7xl mx-auto">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-[#9b87f5] hover:bg-[#7E69AB] text-white h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;