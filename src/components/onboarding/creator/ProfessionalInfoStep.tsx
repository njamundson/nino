import CreatorTypeSelect from "./professional-info/CreatorTypeSelect";
import SkillsSelection from "./professional-info/SkillsSelection";

interface ProfessionalInfoStepProps {
  creatorType: string;
  skills: string[];
  onUpdateField: (field: string, value: string) => void;
  onUpdateSkills: (skills: string[]) => void;
  errors: {
    creatorType?: string;
    skills?: string;
  };
}

const ProfessionalInfoStep = ({
  creatorType,
  skills,
  onUpdateField,
  onUpdateSkills,
  errors,
}: ProfessionalInfoStepProps) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">Professional Details</h1>
        <p className="text-nino-gray text-sm">Tell us about your expertise</p>
      </div>

      <div className="space-y-6">
        <CreatorTypeSelect 
          creatorType={creatorType} 
          onUpdateField={onUpdateField}
          error={errors.creatorType}
        />
        <SkillsSelection 
          skills={skills} 
          onUpdateSkills={onUpdateSkills}
          error={errors.skills}
        />
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;