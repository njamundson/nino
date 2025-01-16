import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProjectCardProps {
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    perks: string[] | null;
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
    };
  };
}

const ProjectCard = ({ opportunity }: ProjectCardProps) => {
  const navigate = useNavigate();
  const defaultImage = "/lovable-uploads/0bd08fc1-3642-4557-b5b0-c5cf19d9f06c.png";

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[3/4]">
        <img
          src={defaultImage}
          alt={opportunity.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-4 right-4 rounded-full bg-white/90 hover:bg-white"
          onClick={() => navigate(`/projects/${opportunity.id}`)}
        >
          <Plus className="h-4 w-4 text-nino-text" />
        </Button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="text-sm font-medium opacity-90">
          {opportunity.brand.company_name}
        </p>
        <h3 className="mt-1 text-xl font-semibold leading-tight">
          {opportunity.title}
        </h3>
      </div>
    </Card>
  );
};

export default ProjectCard;