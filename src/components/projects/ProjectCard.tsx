import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal";
import { useToast } from "@/hooks/use-toast";
import { Opportunity } from "@/integrations/supabase/types/opportunity";
import ProjectBadges from "./card/ProjectBadges";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ProjectCardProps {
  opportunity: Opportunity & { current_creator_id?: string };
  isCompleted?: boolean;
  onViewDetails?: () => void;
}

const ProjectCard = ({ opportunity, isCompleted = false, onViewDetails }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (onViewDetails) {
      onViewDetails();
    } else {
      setShowModal(true);
    }
  };
  
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={opportunity.image_url || "/placeholder.svg"}
          alt={opportunity.title}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <ProjectBadges 
          applications={opportunity.applications}
          isCompleted={isCompleted}
          currentCreatorId={opportunity.current_creator_id}
        />

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-white/90 mb-1">
                {opportunity.brand?.company_name || "Unknown Brand"}
              </p>
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                {opportunity.title}
              </h3>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleViewDetails}
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {showModal && !onViewDetails && (
        <ProjectModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          opportunity={opportunity}
          isCompleted={isCompleted}
        />
      )}
    </>
  );
};

export default ProjectCard;