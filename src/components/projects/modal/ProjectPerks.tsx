import { Badge } from "@/components/ui/badge";

interface ProjectPerksProps {
  perks: string[];
}

const ProjectPerks = ({ perks }: ProjectPerksProps) => {
  if (!perks || perks.length === 0) return null;

  return (
    <div className="space-y-4 pb-8">
      <h3 className="text-xl font-semibold text-gray-900">Perks</h3>
      <div className="flex flex-wrap gap-2">
        {perks.map((perk, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="px-4 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full"
          >
            {perk}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProjectPerks;