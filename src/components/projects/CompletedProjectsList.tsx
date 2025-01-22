import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

        // Fetch opportunities and their associated brands in a single query
        const { data: opportunities, error: oppsError } = await supabase
          .from('opportunities')
          .select(`
            id,
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
          `)
          .eq('status', 'completed');

        if (oppsError) {
          console.error("Error fetching opportunities:", oppsError);
          toast({
            title: "Error",
            description: "Could not fetch completed projects",
            variant: "destructive",
          });
          return [];
        }

        console.log("Fetched opportunities with brands:", opportunities);
        return opportunities || [];
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
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
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
        <ProjectCard key={project.id} opportunity={project} />
      ))}
    </div>
  );
};

export default CompletedProjectsList;