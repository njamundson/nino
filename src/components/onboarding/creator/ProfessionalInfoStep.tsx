import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

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
  const creatorTypes = ["Solo", "Couple", "Family", "Group"];
  const availableSkills = [
    "UGC Creator",
    "Videographer",
    "Photographer",
    "Model/Talent",
    "Public Relations/Writer",
  ];

  const toggleSkill = (skill: string) => {
    const updatedSkills = skills.includes(skill)
      ? skills.filter((s) => s !== skill)
      : [...skills, skill];
    onUpdateSkills(updatedSkills);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <Label>Creator Type</Label>
        <Select
          value={creatorType}
          onValueChange={(value) => onUpdateField("creatorType", value)}
        >
          <SelectTrigger className="bg-nino-bg border-transparent focus:border-nino-primary">
            <SelectValue placeholder="Select your creator type" />
          </SelectTrigger>
          <SelectContent>
            {creatorTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase()}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Skills</Label>
        <div className="flex flex-wrap gap-2">
          {availableSkills.map((skill) => (
            <Button
              key={skill}
              variant="outline"
              onClick={() => toggleSkill(skill)}
              className={`
                transition-all duration-200
                ${
                  skills.includes(skill)
                    ? "bg-nino-primary text-white hover:bg-nino-primary/90"
                    : "bg-nino-bg border-transparent hover:border-nino-primary"
                }
              `}
            >
              {skill}
              {skills.includes(skill) && <X className="w-4 h-4 ml-2" />}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;