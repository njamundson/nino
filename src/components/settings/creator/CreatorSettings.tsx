import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import CreatorProfileForm from "./CreatorProfileForm";
import ProfileImageSection from "../profile/ProfileImageSection";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CreatorSettings = () => {
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
    <div className="max-w-4xl mx-auto">
      <div className="space-y-12 animate-fadeIn">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-medium text-nino-text tracking-tight">Creator Profile</h1>
          <p className="text-nino-gray text-lg">Manage your personal information and settings</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-12 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] space-y-12">
          <ProfileImageSection 
            profileImage={profileImage} 
            setProfileImage={setProfileImage}
          />

          <CreatorProfileForm
            loading={loading}
            creatorData={creatorData}
            onUpdateField={handleUpdateField}
          />

          <div className="pt-6 border-t border-gray-100">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-black hover:bg-black/90 text-white rounded-xl h-12 text-base font-medium transition-all duration-200 hover:scale-[0.98]"
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

export default CreatorSettings;