import { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, UserRound, Bell, CreditCard } from "lucide-react";
import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import CreatorProfileForm from "@/components/settings/creator/CreatorProfileForm";
import ProfileImageSection from "@/components/settings/profile/ProfileImageSection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
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
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="flex justify-end mb-8">
        {activeTab === 'profile' && (
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#A55549] hover:bg-[#A55549]/90 text-[#FFFFFF] px-6"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="relative bg-[#F9F6F2] p-1 rounded-full flex w-fit mb-6">
        <div
          className="absolute inset-y-1 transition-all duration-200 ease-in-out rounded-full bg-[#A55549] shadow-sm"
          style={{
            width: "calc(50% - 8px)",
            left: activeTab === 'profile' ? '4px' : '50%',
          }}
        />
        <button
          onClick={() => setActiveTab('profile')}
          className={`relative px-6 py-2 text-sm font-medium transition-colors rounded-full ${
            activeTab === 'profile'
              ? 'text-[#FFFFFF]'
              : 'text-[#8E9196] hover:text-[#282828]'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`relative px-6 py-2 text-sm font-medium transition-colors rounded-full ${
            activeTab === 'account'
              ? 'text-[#FFFFFF]'
              : 'text-[#8E9196] hover:text-[#282828]'
          }`}
        >
          Account
        </button>
      </div>

      {activeTab === 'profile' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFFFF] rounded-2xl p-8 shadow-lg"
        >
          <div className="space-y-8">
            <ProfileImageSection 
              profileImage={profileImage} 
              setProfileImage={setProfileImage}
            />
            <CreatorProfileForm
              loading={loading}
              creatorData={creatorData}
              onUpdateField={handleUpdateField}
              isEditing={isEditing}
            />
            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-[#A55549] hover:bg-[#A55549]/90 text-[#FFFFFF]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFFFF] rounded-2xl p-8 shadow-lg space-y-8"
        >
          <div>
            <h2 className="text-xl font-semibold mb-6 text-[#282828]">Notifications</h2>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-[#282828]">Push Notifications</Label>
                <p className="text-sm text-[#737373]">Receive notifications about messages and updates</p>
              </div>
              <Switch
                checked={creatorData.notifications_enabled || false}
                onCheckedChange={(checked) => handleUpdateField("notifications_enabled", checked)}
                className="data-[state=checked]:bg-[#A55549]"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6 text-[#282828]">Subscription</h2>
            <Button
              onClick={handleManageSubscription}
              className="w-full bg-[#A55549] hover:bg-[#A55549]/90 text-[#FFFFFF]"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Subscription
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;