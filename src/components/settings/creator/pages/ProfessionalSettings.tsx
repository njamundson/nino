import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CreatorTypeSelect from "../../onboarding/creator/professional-info/CreatorTypeSelect";
import SkillsSelection from "../../onboarding/creator/professional-info/SkillsSelection";

const ProfessionalSettings = () => {
  const {
    loading,
    creatorData,
    setCreatorData,
    handleSave,
  } = useCreatorSettings();

  const handleUpdateField = (field: string, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto pt-12 px-6 pb-24">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">Professional & Social</h1>
      
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <CreatorTypeSelect
            creatorType={creatorData.creatorType}
            onUpdateField={handleUpdateField}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Skills & Expertise</Label>
            <SkillsSelection
              skills={creatorData.specialties}
              onUpdateSkills={(skills) => handleUpdateField("specialties", skills)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Instagram Username</Label>
            <Input
              value={creatorData.instagram}
              onChange={(e) => handleUpdateField("instagram", e.target.value)}
              className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-black rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Website</Label>
            <Input
              value={creatorData.website}
              onChange={(e) => handleUpdateField("website", e.target.value)}
              className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-black rounded-xl"
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

export default ProfessionalSettings;