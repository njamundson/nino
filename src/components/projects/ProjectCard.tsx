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
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails();
    } else {
      setShowModal(true);
    }
  };
  
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-[32px] border-0 bg-white/80 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 cursor-pointer h-[400px]"
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-50 animate-pulse rounded-[32px]" />
        )}
        <img
          src={opportunity.image_url || "/placeholder.svg"}
          alt={opportunity.title}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-[32px] ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100 rounded-[32px]" />
        
        <ProjectBadges 
          applications={opportunity.applications}
          isCompleted={isCompleted}
          currentCreatorId={opportunity.current_creator_id}
        />

        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-white/90 mb-1.5 font-medium tracking-wide">
                {opportunity.brand?.company_name || "Unknown Brand"}
              </p>
              <h3 className="text-2xl font-semibold mb-3 line-clamp-2 tracking-tight">
                {opportunity.title}
              </h3>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleViewDetails}
                className="bg-white/95 hover:bg-white text-gray-900 rounded-full px-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
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