import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal";
import { useToast } from "@/components/ui/use-toast";

interface ProjectCardProps {
  opportunity: {
    id: string;
    title: string;
    description: string;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    perks: string[] | null;
    requirements: string[] | null;
    payment_details: string | null;
    compensation_details: string | null;
    deliverables: string[] | null;
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
    };
  };
}

const ProjectCard = ({ opportunity }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleViewDetails = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      navigate(`/projects/${opportunity.id}`);
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
        <img
          src="/placeholder.svg"
          alt={opportunity.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-20 left-6 right-6 text-white">
          <p className="text-sm font-medium text-white/90 mb-1">
            {opportunity.brand.company_name}
          </p>
          <h3 className="text-2xl font-semibold leading-tight line-clamp-2">
            {opportunity.title}
          </h3>
        </div>

        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-6 right-6 rounded-full bg-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md"
          onClick={handleViewDetails}
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
      />
    </>
  );
};

export default ProjectCard;