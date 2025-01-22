import { useCreatorSettings } from "@/hooks/useCreatorSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft } from "lucide-react";
import CreatorTypeSelect from "@/components/onboarding/creator/professional-info/CreatorTypeSelect";
import SkillsSelection from "@/components/onboarding/creator/professional-info/SkillsSelection";

interface ProfessionalSettingsProps {
  onBack: () => void;
}

const ProfessionalSettings = ({ onBack }: ProfessionalSettingsProps) => {
  const { loading, creatorData, setCreatorData, handleSave } = useCreatorSettings();

  const handleUpdateField = (field: string, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
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
        <h1 className="text-3xl font-semibold text-nino-text">Professional & Social</h1>
      </div>
      
      <div className="space-y-8">
        <div className="bg-nino-white rounded-2xl p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] space-y-6">
          <CreatorTypeSelect
            creatorType={creatorData.creatorType}
            onUpdateField={handleUpdateField}
          />

          <div className="space-y-2">
            <Label className="text-sm font-medium text-nino-text">Skills & Expertise</Label>
            <SkillsSelection
              skills={creatorData.specialties}
              onUpdateSkills={(skills) => handleUpdateField("specialties", skills)}
            />
          </div>
        </div>

        <div className="bg-nino-white rounded-2xl p-8 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.1)] space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-nino-text">Instagram Username</Label>
            <Input
              value={creatorData.instagram}
              onChange={(e) => handleUpdateField("instagram", e.target.value)}
              className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-nino-primary rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-nino-text">Website</Label>
            <Input
              value={creatorData.website}
              onChange={(e) => handleUpdateField("website", e.target.value)}
              className="bg-gray-50/50 border-0 focus:ring-2 focus:ring-nino-primary rounded-xl"
            />
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-nino-primary hover:bg-nino-primary/90 text-nino-white h-12"
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