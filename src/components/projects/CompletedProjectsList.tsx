import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Archive } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { Opportunity } from "@/integrations/supabase/types/opportunity";
import { Creator } from "@/integrations/supabase/types/creator";

const CompletedProjectsList = () => {
  const { toast } = useToast();
  
  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['completed-projects-list'],
    queryFn: async () => {
      try {
        console.log('Fetching completed projects list...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!brand) {
          console.log("No brand profile found");
          return [];
        }

        const { data: opportunities, error: oppsError } = await supabase
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
              instagram,
              user_id,
              phone_number,
              support_email,
              profile_image_url,
              sms_notifications_enabled,
              two_factor_enabled,
              created_at,
              updated_at
            ),
            applications (
              id,
              status,
              opportunity_id,
              creator_id,
              cover_letter,
              created_at,
              updated_at,
              initiated_by,
              creator:creators (*)
            )
          `)
          .eq('brand_id', brand.id)
          .eq('status', 'completed')
          .eq('applications.status', 'accepted');

        if (oppsError) {
          console.error("Error fetching opportunities:", oppsError);
          throw oppsError;
        }

        if (!opportunities) {
          console.log("No completed opportunities found");
          return [];
        }

        // Filter opportunities to only include those with accepted applications
        const completedWithAcceptedCreator = opportunities.filter(opp => 
          opp.applications?.some(app => app.status === 'accepted')
        );

        console.log("Fetched completed projects:", completedWithAcceptedCreator);
        return completedWithAcceptedCreator as Opportunity[];
      } catch (error) {
        console.error("Error in query:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });

  if (error) {
    toast({
      title: "Error",
      description: "Could not fetch completed projects",
      variant: "destructive",
    });
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-[400px] animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-4">
          <Archive className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">
            No completed projects yet
          </h3>
          <p className="text-gray-500">
            When you complete projects with creators, they will appear here.
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