import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2, CheckCircle, BadgeCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Application, Opportunity } from "@/integrations/supabase/types/opportunity";

interface ProjectCardProps {
  opportunity: Opportunity;
  isCompleted?: boolean;
}

const ProjectCard = ({ opportunity, isCompleted = false }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if there's an existing application for this opportunity
  const hasInvitation = opportunity.applications?.some(
    (app: Application) => app.initiated_by === "brand" && !app.cover_letter
  );
  
  const handleViewDetails = () => {
    setIsLoading(true);
    try {
      navigate(`/creator/projects/${opportunity.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load project details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
        onClick={() => setShowModal(true)}
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
        
        {isCompleted && (
          <Badge 
            variant="secondary" 
            className="absolute top-6 right-6 bg-green-500 text-white border-0"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </Badge>
        )}

        {hasInvitation && (
          <Badge 
            variant="secondary" 
            className="absolute top-6 right-6 bg-blue-500 text-white border-0 flex items-center gap-1.5"
          >
            <BadgeCheck className="w-4 h-4" />
            Invited
          </Badge>
        )}

        <div className="absolute bottom-20 left-6 right-6 text-white">
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

      {showModal && (
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