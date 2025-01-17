import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/projects/ProjectCard";
import { Loader2 } from "lucide-react";
import ProjectsHeader from "@/components/projects/ProjectsHeader";

const Projects = () => {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          brand:brands (
            company_name,
            brand_type,
            location,
            profile_image_url
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-8">
      <ProjectsHeader />
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
        </div>
      ) : opportunities && opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <ProjectCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-nino-gray mb-2">
            No open opportunities yet
          </h3>
          <p className="text-nino-gray">
            Check back later for new opportunities
          </p>
        </div>
      )}
    </div>
  );
};

export default Projects;