import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SkillsSelectionProps {
  skills: string[];
  onUpdateSkills: (skills: string[]) => void;
}

const SkillsSelection = ({ skills, onUpdateSkills }: SkillsSelectionProps) => {
  const availableSkills = [
    "UGC Creator",
    "Videographer",
    "Photographer",
    "Model/Talent",
    "Public Relations/Writer",
  ];

  const toggleSkill = (skill: string) => {
    console.log('Toggling skill:', skill, 'Current skills:', skills);
    const updatedSkills = skills.includes(skill)
      ? skills.filter((s) => s !== skill)
      : [...skills, skill];
    console.log('Updated skills:', updatedSkills);
    onUpdateSkills(updatedSkills);
  };

  return (
    <div className="space-y-4">
      <Label className="text-base">Skills</Label>
      <div className="flex flex-wrap gap-3">
        {availableSkills.map((skill) => (
          <Button
            key={skill}
            variant="outline"
            onClick={() => toggleSkill(skill)}
            className={`
              rounded-full px-6 py-3 h-auto text-base transition-all duration-200
              ${
                skills.includes(skill)
                  ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-transparent"
                  : "bg-nino-bg border-transparent hover:border-nino-primary text-nino-text"
              }
            `}
          >
            {skill}
            {skills.includes(skill) && <X className="w-4 h-4 ml-2" />}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SkillsSelection;