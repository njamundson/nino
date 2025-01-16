import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectModal from "./ProjectModal";
import ProjectHeader from "./card/ProjectHeader";
import ProjectMetadata from "./card/ProjectMetadata";
import ProjectBadges from "./card/ProjectBadges";

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
  const [showModal, setShowModal] = useState(false);
  
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="relative aspect-[3/4]">
          <img
            src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80"
            alt={opportunity.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="space-y-4">
              <ProjectHeader 
                company_name={opportunity.brand.company_name}
                title={opportunity.title}
              />

              <div className="space-y-2">
                <ProjectMetadata 
                  location={opportunity.location}
                  start_date={opportunity.start_date}
                />

                <ProjectBadges 
                  payment_details={opportunity.payment_details}
                  compensation_details={opportunity.compensation_details}
                />
              </div>
            </div>
          </div>

          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-6 right-6 rounded-full bg-white/90 hover:bg-white transition-all duration-300 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/projects/${opportunity.id}`);
            }}
          >
            <Plus className="h-4 w-4 text-primary" />
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