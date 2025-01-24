import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "lucide-react";
import LocationField from "../../../onboarding/creator/basic-info/fields/LocationField";
import SkillsSelection from "../../../onboarding/creator/professional-info/SkillsSelection";

interface BasicInfoSettingsProps {
  onBack: () => void;
}

const BasicInfoSettings = ({ onBack }: BasicInfoSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [creatorData, setCreatorData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    location: "",
    specialties: [] as string[],
  });

  const handleUpdateField = (field: string, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fullName = e.target.value;
    const [firstName = "", lastName = ""] = fullName.split(" ");
    setCreatorData(prev => ({
      ...prev,
      firstName,
      lastName,
    }));
  };

  const handleSave = () => {
    setLoading(true);
    // Save logic here
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto bg-[#F9F6F2]">
      <div className="max-w-2xl mx-auto pt-12 px-6 pb-24">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="mr-4 text-[#282828] hover:text-[#A55549]"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-semibold text-[#282828]">Basic Information</h1>
        </div>
        
        <div className="bg-[#FFFFFF] rounded-2xl p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#282828]">Full Name</Label>
            <Input
              value={`${creatorData.firstName}${creatorData.lastName ? ' ' + creatorData.lastName : ''}`}
              onChange={handleFullNameChange}
              className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl text-[#282828]"
              placeholder="Enter your full name"
            />
          </div>

          <LocationField
            location={creatorData.location}
            onUpdateField={handleUpdateField}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#282828]">Bio</Label>
            <Textarea
              value={creatorData.bio}
              onChange={(e) => handleUpdateField("bio", e.target.value)}
              className="bg-[#F9F6F2] border-0 focus:ring-2 focus:ring-[#A55549] rounded-xl resize-none h-32 text-[#282828]"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-[#282828]">Skills & Expertise</Label>
            <SkillsSelection
              skills={creatorData.specialties}
              onUpdateSkills={(skills) => handleUpdateField("specialties", skills)}
            />
          </div>
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#A55549] hover:bg-[#A55549]/90 text-[#FFFFFF] h-12 rounded-xl"
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
