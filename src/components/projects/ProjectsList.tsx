import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectCard from "@/components/projects/ProjectCard";
import { Loader2, AlertCircle } from "lucide-react";
import EmptyProjects from "@/components/projects/EmptyProjects";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProjectsList = () => {
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      console.log("Fetching opportunities...");
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          brand:brands (
            id,
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

      console.log("Fetched opportunities:", data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          There was an error loading the projects. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (!opportunities || opportunities.length === 0) {
    return <EmptyProjects />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {opportunities.map((opportunity) => (
        <ProjectCard 
          key={opportunity.id} 
          opportunity={opportunity}
        />
      ))}
    </div>
  );
};

export default ProjectsList;