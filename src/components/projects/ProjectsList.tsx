import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import ProjectCard from "./ProjectCard";
import { useToast } from "@/hooks/use-toast";
import EmptyProjects from "./EmptyProjects";

const ProjectsList = () => {
  const { toast } = useToast();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['available-projects'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!creator) {
          console.log("No creator profile found");
          return [];
        }

        // Get all opportunities that are still open and not already applied to
        const { data: opportunities, error } = await supabase
          .from('opportunities')
          .select(`
            id,
            brand_id,
            title,
            description,
            location,
            start_date,
            end_date,
            perks,
            requirements,
            payment_details,
            compensation_details,
            deliverables,
            image_url,
            status,
            brand:brands (
              id,
              company_name,
              brand_type,
              location,
              description,
              website,
              instagram
            ),
            applications!inner (
              id,
              status,
              creator_id
            )
          `)
          .eq('status', 'open')
          .not('applications.creator_id', 'eq', creator.id);

        if (error) {
          console.error("Error fetching opportunities:", error);
          toast({
            title: "Error",
            description: "Could not fetch available projects",
            variant: "destructive",
          });
          return [];
        }

        console.log("Fetched available projects:", opportunities);
        return opportunities || [];
      } catch (error) {
        console.error("Error in query:", error);
        toast({
          title: "Error",
          description: "Could not fetch available projects",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[400px] animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return <EmptyProjects />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} opportunity={project} />
      ))}
    </div>
  );
};

export default ProjectsList;