import { Badge } from "@/components/ui/badge";

interface CreatorSpecialtiesProps {
  specialties: string[] | null;
}

const CreatorSpecialties = ({ specialties }: CreatorSpecialtiesProps) => {
  if (!specialties?.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-nino-text">Specialties</h3>
      <div className="flex flex-wrap gap-2 max-w-full">
        {specialties.map((specialty, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="px-3 py-1 rounded-full border-[1.5px] border-nino-primary/20 text-nino-primary/90 bg-white/50 hover:bg-white/80 transition-all duration-300 hover:border-nino-primary/40 whitespace-nowrap"
          >
            {specialty}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CreatorSpecialties;