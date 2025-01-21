import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import ProfileImageSection from "../../profile/ProfileImageSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const BasicInfoSettings = () => {
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
    <div className="max-w-2xl mx-auto pt-12 px-6 pb-24">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Basic Information</h1>
      
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <ProfileImageSection 
            profileImage={profileImage} 
            setProfileImage={setProfileImage}
          />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">First Name</Label>
              <Input
                value={creatorData.firstName}
                onChange={(e) => handleUpdateField("firstName", e.target.value)}
                className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-black rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Last Name</Label>
              <Input
                value={creatorData.lastName}
                onChange={(e) => handleUpdateField("lastName", e.target.value)}
                className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-black rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Location</Label>
            <Input
              value={creatorData.location}
              onChange={(e) => handleUpdateField("location", e.target.value)}
              className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-black rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Bio</Label>
            <Textarea
              value={creatorData.bio}
              onChange={(e) => handleUpdateField("bio", e.target.value)}
              className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-black rounded-xl resize-none h-32"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-black hover:bg-black/90 text-white h-12"
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
  );
};

export default BasicInfoSettings;