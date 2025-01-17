import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const getInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
        onClick={() => setShowModal(true)}
      >
        <div className="relative h-full p-6">
          {/* Status Badge */}
          <div className="mb-4">
            <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-full">
              Active
            </span>
          </div>

          {/* Company Info */}
          <div className="mb-4">
            <Avatar className="h-12 w-12 mb-3">
              <AvatarFallback>{getInitials(opportunity.brand.company_name)}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-gray-600 mb-1">{opportunity.brand.company_name}</p>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {opportunity.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {opportunity.description}
          </p>

          {/* Location */}
          {opportunity.location && (
            <p className="text-sm text-gray-600 mb-4">
              📍 {opportunity.location}
            </p>
          )}

          {/* Action Button */}
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
        </div>
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