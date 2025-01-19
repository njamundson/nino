import { Card } from "@/components/ui/card";
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
    <Card className="p-6 bg-white/50 backdrop-blur-xl border-0 shadow-sm space-y-8">
      <ProfileImageSection 
        profileImage={profileImage} 
        setProfileImage={setProfileImage}
      />

      <CreatorProfileForm
        loading={loading}
        creatorData={creatorData}
        onUpdateField={handleUpdateField}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-nino-primary hover:bg-nino-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </Card>
  );
};

export default CreatorSettings;
