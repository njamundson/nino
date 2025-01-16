import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import { Loader2 } from "lucide-react";

const Projects = () => {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select(`
          *,
          brand:brands(
            company_name,
            brand_type,
            location
          )
        `)
        .eq("status", "open")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <ProjectsHeader />
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities?.map((opportunity) => (
            <ProjectCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;