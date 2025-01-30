import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Archive } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { Opportunity } from "@/integrations/supabase/types/opportunity";

const CompletedProjectsList = () => {
  const { toast } = useToast();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ['completed-projects'],
    queryFn: async () => {
      try {
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
              creator:creators (
                id,
                first_name,
                last_name,
                bio,
                location,
                instagram,
                website,
                specialties,
                creator_type,
                profile_image_url
              )
            )
          `)
          .eq('brand_id', brand.id)
          .eq('status', 'completed')
          // Only get opportunities that have at least one accepted application
          .not('applications', 'is', null)
          .order('end_date', { ascending: false });

        if (oppsError) {
          console.error("Error fetching opportunities:", oppsError);
          toast({
            title: "Error",
            description: "Could not fetch completed projects",
            variant: "destructive",
          });
          return [];
        }

        // Filter opportunities to only include those with accepted applications
        const completedWithAcceptedCreator = opportunities?.filter(opp => 
          opp.applications?.some(app => app.status === 'accepted')
        );

        // Transform the data to match the Opportunity type
        const transformedOpportunities = completedWithAcceptedCreator?.map(opp => ({
          ...opp,
          brand: {
            ...opp.brand,
            sms_notifications_enabled: opp.brand?.sms_notifications_enabled ?? true,
            two_factor_enabled: opp.brand?.two_factor_enabled ?? false,
            created_at: opp.brand?.created_at ?? opp.created_at,
            updated_at: opp.brand?.updated_at ?? opp.updated_at,
          },
          applications: opp.applications?.map(app => ({
            ...app,
            opportunity_id: opp.id,
            created_at: app.created_at || opp.created_at,
            updated_at: app.updated_at || opp.updated_at,
            initiated_by: app.initiated_by || 'creator'
          }))
        })) as Opportunity[];

        console.log("Fetched completed projects:", transformedOpportunities);
        return transformedOpportunities || [];
      } catch (error) {
        console.error("Error in query:", error);
        toast({
          title: "Error",
          description: "Could not fetch completed projects",
          variant: "destructive",
        });
        return [];
      }
    },
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes to check for newly completed projects
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