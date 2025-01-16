import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
}

const CreatorFilters = ({ selectedSpecialties, onSpecialtyChange }: CreatorFiltersProps) => {
  const specialties = [
    "UGC",
    "Videography",
    "Photography",
    "Model/Talent",
    "Public Relations"
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {specialties.map((specialty) => (
          <Badge
            key={specialty}
            variant="outline"
            className={cn(
              "px-6 py-2.5 text-sm font-medium cursor-pointer rounded-full transition-all duration-200 border-2",
              selectedSpecialties.includes(specialty)
                ? "bg-[#8B5CF6] border-[#8B5CF6] text-white hover:bg-[#7C3AED] hover:border-[#7C3AED]"
                : "bg-[#E5DEFF] border-transparent text-[#6E59A5] hover:bg-[#D6BCFA] hover:text-[#553C9A]"
            )}
            onClick={() => onSpecialtyChange(specialty)}
          >
            {specialty}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CreatorFilters;