import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/lib/utils";
import ProjectModal from "./ProjectModal";

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
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">
                  {opportunity.brand.company_name}
                </p>
                <h3 className="text-2xl font-semibold leading-tight">
                  {opportunity.title}
                </h3>
              </div>

              <div className="space-y-2">
                {opportunity.location && (
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    📍 {opportunity.location}
                  </p>
                )}
                
                {opportunity.start_date && (
                  <p className="text-sm text-white/80">
                    🗓️ {formatDate(opportunity.start_date)}
                  </p>
                )}

                {opportunity.perks && opportunity.perks.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {opportunity.perks.slice(0, 2).map((perk, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        {perk}
                      </Badge>
                    ))}
                    {opportunity.perks.length > 2 && (
                      <Badge
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        +{opportunity.perks.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
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
            <Plus className="h-4 w-4 text-nino-text" />
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