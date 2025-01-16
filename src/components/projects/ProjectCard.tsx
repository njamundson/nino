import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
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

  return (
    <Card className="hover:border-nino-primary/20 transition-colors">
      <CardHeader className="space-y-4">
        <div>
          <Badge variant="secondary" className="mb-2">
            {opportunity.brand.brand_type}
          </Badge>
          <h3 className="text-xl font-medium text-nino-text">
            {opportunity.title}
          </h3>
          <p className="text-sm text-nino-gray">{opportunity.brand.company_name}</p>
        </div>

        {(opportunity.location || opportunity.brand.location) && (
          <div className="flex items-center gap-2 text-sm text-nino-gray">
            <MapPin className="w-4 h-4" />
            <span>{opportunity.location || opportunity.brand.location}</span>
          </div>
        )}

        {opportunity.start_date && (
          <div className="flex items-center gap-2 text-sm text-nino-gray">
            <Calendar className="w-4 h-4" />
            <span>
              Starts {new Date(opportunity.start_date).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-nino-text line-clamp-3">{opportunity.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        {opportunity.perks && opportunity.perks.length > 0 && (
          <div className="flex flex-wrap gap-2 w-full">
            {opportunity.perks.map((perk) => (
              <Badge key={perk} variant="outline">
                {perk}
              </Badge>
            ))}
          </div>
        )}
        
        <Button 
          className="w-full" 
          onClick={() => navigate(`/projects/${opportunity.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;