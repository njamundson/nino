import { Label } from "@/components/ui/label";
import CreatorTypeSelect from "./professional-info/CreatorTypeSelect";
import SkillsSelection from "./professional-info/SkillsSelection";

interface ProfessionalInfoStepProps {
  creatorType: string;
  skills: string[];
  onUpdateField: (field: string, value: string) => void;
  onUpdateSkills: (skills: string[]) => void;
}

const ProfessionalInfoStep = ({
  creatorType,
  skills,
  onUpdateField,
  onUpdateSkills,
}: ProfessionalInfoStepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Professional Details</h1>
        <p className="text-nino-gray text-sm">Tell us about your expertise</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-base flex items-center gap-1">
            Creator Type
            <span className="text-red-500">*</span>
          </Label>
          <CreatorTypeSelect 
            creatorType={creatorType} 
            onUpdateField={onUpdateField} 
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-base flex items-center gap-1">
            Skills
            <span className="text-red-500">*</span>
          </Label>
          <SkillsSelection 
            skills={skills} 
            onUpdateSkills={onUpdateSkills} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;