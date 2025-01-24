import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, UserRound, Bell } from "lucide-react";
import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import CreatorProfileForm from "@/components/settings/creator/CreatorProfileForm";
import ProfileImageSection from "@/components/settings/profile/ProfileImageSection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const {
    loading,
    profileImage,
    creatorData,
    setProfileImage,
    setCreatorData,
    handleSave,
  } = useCreatorSettings();
  const { toast } = useToast();

  const handleUpdateField = (field: string, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleManageSubscription = async () => {
    toast({
      title: "Coming Soon",
      description: "Subscription management will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-medium text-[#282828]">Settings</h1>
            <p className="text-[#737373] mt-2">Manage your account settings and preferences</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#A55549] hover:bg-[#A55549]/90 text-white px-6"
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

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#A55549] text-white'
                : 'text-[#282828] hover:bg-[#A55549]/10'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'account'
                ? 'bg-[#A55549] text-white'
                : 'text-[#282828] hover:bg-[#A55549]/10'
            }`}
          >
            Account
          </button>
        </div>

        {activeTab === 'profile' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#FFFFFF] rounded-2xl p-8 shadow-lg"
            >
              <div className="relative">
                <UserRound className="absolute top-0 right-0 w-6 h-6 text-[#282828]" />
                <h2 className="text-xl font-semibold mb-6 text-[#282828]">Profile</h2>
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
              className="bg-[#FFFFFF] rounded-2xl p-8 shadow-lg"
            >
              <div className="relative">
                <SettingsIcon className="absolute top-0 right-0 w-6 h-6 text-[#282828]" />
                <h2 className="text-xl font-semibold mb-6 text-[#282828]">Details</h2>
                <CreatorProfileForm
                  loading={loading}
                  creatorData={creatorData}
                  onUpdateField={handleUpdateField}
                />
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#FFFFFF] rounded-2xl p-8 shadow-lg"
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-6 text-[#282828]">Notifications</h2>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-[#282828]">Push Notifications</Label>
                    <p className="text-sm text-[#737373]">Receive notifications about messages and updates</p>
                  </div>
                  <Switch
                    checked={creatorData.notifications_enabled}
                    onCheckedChange={(checked) => handleUpdateField("notifications_enabled", checked)}
                    className="data-[state=checked]:bg-[#A55549]"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-6 text-[#282828]">Subscription</h2>
                <Button
                  onClick={handleManageSubscription}
                  className="w-full bg-[#A55549] hover:bg-[#A55549]/90 text-white"
                >
                  Manage Subscription
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;