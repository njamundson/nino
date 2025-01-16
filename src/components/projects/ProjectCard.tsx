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
  
  // Array of resort images from Unsplash
  const resortImages = [
    "https://images.unsplash.com/photo-1472396961693-142e6e269027",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
    "https://images.unsplash.com/photo-1458668383970-8ddd3927deed",
    "https://images.unsplash.com/photo-1504893524553-b855bce32c67",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b",
    "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3"
  ];

  // Get a deterministic image based on the opportunity id
  const getImageUrl = () => {
    const index = opportunity.id.charCodeAt(0) % resortImages.length;
    return `${resortImages[index]}?auto=format&fit=crop&w=800&q=80`;
  };

  return (
    <Card className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[3/4]">
        <img
          src={getImageUrl()}
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