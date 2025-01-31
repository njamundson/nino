import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CREATOR_SPECIALTIES } from "@/types/creator-constants";

export interface SkillsSelectionProps {
  skills: string[];
  onUpdateSkills: (skills: string[]) => void;
}

const SkillsSelection = ({ skills, onUpdateSkills }: SkillsSelectionProps) => {
  const toggleSkill = (skill: string) => {
    const updatedSkills = skills.includes(skill)
      ? skills.filter((s) => s !== skill)
      : [...skills, skill];
    onUpdateSkills(updatedSkills);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {CREATOR_SPECIALTIES.map((skill) => (
        <Button
          key={skill}
          variant="outline"
          onClick={() => toggleSkill(skill)}
          className={`
            rounded-full px-6 py-3 h-auto text-base transition-all duration-200
            ${
              skills.includes(skill)
                ? "bg-[#A55549] text-[#FFFFFF] hover:bg-[#A55549]/90 border-transparent"
                : "bg-[#F9F6F2] border-transparent hover:border-[#A55549] text-[#282828]"
            }
          `}
        >
          {skill}
          {skills.includes(skill) && <X className="w-4 h-4 ml-2" />}
        </Button>
      ))}
    </div>
  );
};

export default SkillsSelection;