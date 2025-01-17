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
      profile_image_url: string | null;
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
        <div className="relative h-full">
          {/* Status Badge */}
          <div className="absolute top-6 left-6 z-10">
            <span className="px-3 py-1 text-sm font-medium text-green-600 bg-green-50 rounded-full">
              Active
            </span>
          </div>

          {/* Brand Info */}
          <div className="absolute top-16 left-6 right-6 z-10">
            <p className="text-sm font-medium text-gray-600 mb-2">
              {opportunity.brand.company_name}
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 line-clamp-2">
              {opportunity.title}
            </h3>
          </div>

          {/* Location and Date */}
          <div className="absolute top-36 left-6 right-6 z-10">
            {opportunity.location && (
              <p className="text-sm text-gray-600 mb-1">
                📍 {opportunity.location}
              </p>
            )}
            {opportunity.start_date && (
              <p className="text-sm text-gray-600">
                🗓️ Starts {new Date(opportunity.start_date).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Brand Avatar */}
          <div className="absolute bottom-24 left-6 z-10">
            <Avatar className="h-12 w-12 border-2 border-white shadow-md">
              <AvatarImage src={opportunity.brand.profile_image_url || undefined} />
              <AvatarFallback>
                {opportunity.brand.company_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Payment Details */}
          <div className="absolute bottom-6 left-6 right-20 z-10">
            {opportunity.payment_details && (
              <p className="text-sm font-medium text-gray-900">
                💰 {opportunity.payment_details}
              </p>
            )}
          </div>

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