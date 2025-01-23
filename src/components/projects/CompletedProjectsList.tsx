import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Archive } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { useToast } from "@/hooks/use-toast";

const CompletedProjectsList = () => {
  const { toast } = useToast();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['completed-projects'],
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

        const { data: applications, error: appsError } = await supabase
          .from('applications')
          .select(`
            id,
            status,
            opportunity:opportunities (
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
              brand:brands (
                id,
                company_name,
                brand_type,
                location,
                description,
                website,
                instagram
              )
            )
          `)
          .eq('creator_id', creator.id)
          .eq('status', 'completed');

        if (appsError) {
          console.error("Error fetching applications:", appsError);
          toast({
            title: "Error",
            description: "Could not fetch completed projects",
            variant: "destructive",
          });
          return [];
        }

        // Map the applications to match the opportunity structure
        const completedProjects = applications.map(app => ({
          ...app.opportunity,
          application_status: app.status,
          application_id: app.id,
          brand_id: app.opportunity.brand_id // Ensure brand_id is included
        }));

        console.log("Fetched completed projects:", completedProjects);
        return completedProjects || [];
      } catch (error) {
        console.error("Error in query:", error);
        toast({
          title: "Error",
          description: "Could not fetch completed projects",
          variant: "destructive",
        });
        return [];
      }
    }
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
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <Archive className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No completed projects yet
          </h3>
          <p className="text-gray-500">
            When you complete projects with brands, they will appear here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          opportunity={project}
          isCompleted={true}
        />
      ))}
    </div>
  );
};

export default CompletedProjectsList;