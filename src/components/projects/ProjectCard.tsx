import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Brand {
  id: string;
  company_name: string | null;
  brand_type: string | null;
  location: string | null;
  description: string | null;
  website: string | null;
  instagram: string | null;
}

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  perks: string[] | null;
  requirements: string[] | null;
  payment_details: string | null;
  compensation_details: string | null;
  deliverables: string[] | null;
  brand: Brand | null;
  image_url: string | null;
  application_status?: string;
  application_id?: string;
}

interface ProjectCardProps {
  opportunity: Opportunity;
  isCompleted?: boolean;
}

const ProjectCard = ({ opportunity, isCompleted = false }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
  
  const brandName = opportunity.brand?.company_name || "Unnamed Brand";
  
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
        onClick={() => setShowModal(true)}
      >
        <img
          src={opportunity.image_url || "/placeholder.svg"}
          alt={opportunity.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
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

        <div className="absolute bottom-20 left-6 right-6 text-white">
          <p className="text-sm font-medium text-white/90 mb-1">
            {brandName}
          </p>
          <h3 className="text-2xl font-semibold leading-tight line-clamp-2">
            {opportunity.title}
          </h3>
          {opportunity.location && (
            <p className="text-sm text-white/80 mt-2">
              📍 {opportunity.location}
            </p>
          )}
        </div>

        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-6 right-6 rounded-full bg-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 text-gray-900" />
          )}
        </Button>
      </Card>

      <ProjectModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        opportunity={opportunity}
        isCompleted={isCompleted}
      />
    </>
  );
};

export default ProjectCard;