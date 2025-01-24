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
    <div className="min-h-screen bg-nino-bg relative pb-24">
      <div className="max-w-2xl mx-auto px-6 pt-12">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-4"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-semibold text-nino-text">Basic Information</h1>
        </div>
        
        <div className="space-y-8">
          <div className="bg-nino-white rounded-2xl p-8 shadow-sm">
            <ProfileImageSection 
              profileImage={profileImage} 
              setProfileImage={setProfileImage}
            />
          </div>

          <div className="bg-nino-white rounded-2xl p-8 shadow-sm space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-nino-text">Full Name or Creator Name</Label>
              <Input
                value={`${creatorData.firstName}${creatorData.lastName ? ' ' + creatorData.lastName : ''}`}
                onChange={handleFullNameChange}
                className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200"
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-nino-text">Location</Label>
              <Input
                value={creatorData.location}
                onChange={(e) => handleUpdateField("location", e.target.value)}
                className="h-12 text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200"
                placeholder="Where are you based?"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-nino-text">Bio</Label>
              <Textarea
                value={creatorData.bio}
                onChange={(e) => handleUpdateField("bio", e.target.value)}
                className="min-h-[160px] text-[15px] bg-gray-50/50 border-0 rounded-xl shadow-sm ring-1 ring-gray-200/70 focus:ring-2 focus:ring-gray-300 transition-shadow duration-200 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-nino-primary hover:bg-nino-primary/90 text-nino-white h-12 rounded-xl font-medium"
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
  );
};

export default BasicInfoSettings;