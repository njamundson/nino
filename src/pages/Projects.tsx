import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/projects/ProjectCard";
import { Loader2, AlertCircle } from "lucide-react";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EmptyProjects from "@/components/projects/EmptyProjects";
import PageHeader from "@/components/shared/PageHeader";

const Projects = () => {
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      console.log("Fetching opportunities...");
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          brand:brands (
            company_name,
            brand_type,
            location,
            description,
            website,
            instagram
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching opportunities:", error);
        throw error;
      }

      console.log("Fetched opportunities:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <PageHeader 
          title="Available Projects" 
          description="Browse and apply to brand collaboration opportunities that match your expertise"
        />
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-nino-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8 space-y-8">
        <PageHeader 
          title="Available Projects" 
          description="Browse and apply to brand collaboration opportunities that match your expertise"
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            There was an error loading the projects. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="container py-8 space-y-8">
        <PageHeader 
          title="Available Projects" 
          description="Browse and apply to brand collaboration opportunities that match your expertise"
        />
        <EmptyProjects />
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <PageHeader 
        title="Available Projects" 
        description="Browse and apply to brand collaboration opportunities that match your expertise"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opportunity) => (
          <ProjectCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
};

export default Projects;