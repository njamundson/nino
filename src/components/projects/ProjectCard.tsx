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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectCardProps {
  opportunity: Opportunity & { current_creator_id?: string };
  isCompleted?: boolean;
}

const ProjectCard = ({ opportunity, isCompleted = false }: ProjectCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const queryClient = useQueryClient();

  // Check if the current creator has already applied
  const { data: hasApplied } = useQuery({
    queryKey: ['application-status', opportunity.id],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user found");
          return false;
        }

        // Get the creator record for the current user
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) {
          console.error("Error fetching creator:", creatorError);
          return false;
        }

        if (!creator) {
          console.log("No creator record found");
          return false;
        }

        // Check if there's an existing application
        const { data: application, error: applicationError } = await supabase
          .from('applications')
          .select('id')
          .eq('opportunity_id', opportunity.id)
          .eq('creator_id', creator.id)
          .maybeSingle();

        if (applicationError) {
          console.error("Error checking application:", applicationError);
          return false;
        }

        return !!application;
      } catch (error) {
        console.error("Error in hasApplied query:", error);
        return false;
      }
    },
    staleTime: 0, // Set to 0 to ensure immediate updates
  });
  
  // Subscribe to real-time updates for applications
  useState(() => {
    const channel = supabase
      .channel('application-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `opportunity_id=eq.${opportunity.id}`,
        },
        () => {
          // Invalidate the query to trigger a refresh
          queryClient.invalidateQueries({
            queryKey: ['application-status', opportunity.id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [opportunity.id, queryClient]);

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
        
        <ProjectBadges 
          applications={opportunity.applications}
          isCompleted={isCompleted}
          currentCreatorId={opportunity.current_creator_id}
        />

        {hasApplied && (
          <div className="absolute top-4 left-4 z-10">
            <Badge 
              variant="secondary" 
              className="bg-green-100 text-green-800 border-0 flex items-center gap-1.5 animate-fadeIn"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </Badge>
          </div>
        )}

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