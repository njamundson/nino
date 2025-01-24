import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import ProfileImageSection from "../../profile/ProfileImageSection";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "lucide-react";

interface BasicInfoSettingsProps {
  onBack: () => void;
}

const BasicInfoSettings = ({ onBack }: BasicInfoSettingsProps) => {
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

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    const names = fullName.trim().split(/\s+/);
    
    if (names.length >= 2) {
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');
      handleUpdateField('firstName', firstName);
      handleUpdateField('lastName', lastName);
    } else {
      handleUpdateField('firstName', fullName);
      handleUpdateField('lastName', '');
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 px-6 pb-24">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-4"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-3xl font-semibold text-gray-900">Basic Information</h1>
      </div>
      
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <ProfileImageSection 
            profileImage={profileImage} 
            setProfileImage={setProfileImage}
          />
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Full Name or Creator Name</Label>
            <Input
              value={`${creatorData.firstName}${creatorData.lastName ? ' ' + creatorData.lastName : ''}`}
              onChange={handleFullNameChange}
              className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-black rounded-xl"
              placeholder="Enter your full name"
            />
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