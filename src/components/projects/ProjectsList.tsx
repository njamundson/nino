import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import ProjectCard from "./ProjectCard";
import { useToast } from "@/hooks/use-toast";
import EmptyProjects from "./EmptyProjects";
import { Opportunity } from "@/integrations/supabase/types/opportunity";
import { motion } from "framer-motion";

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

        const { data: opportunities, error } = await supabase
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
              updated_at,
              onboarding_completed
            ),
            applications!left (
              id,
              status,
              creator_id,
              initiated_by,
              cover_letter,
              created_at,
              updated_at,
              opportunity_id
            )
          `)
          .eq('status', 'open');

        if (error) {
          console.error("Error fetching opportunities:", error);
          toast({
            title: "Error",
            description: "Could not fetch available projects",
            variant: "destructive",
          });
          return [];
        }

        const opportunitiesWithCreatorId = opportunities?.map(opp => ({
          ...opp,
          current_creator_id: creator.id
        })) as Opportunity[];

        console.log("Fetched available projects:", opportunitiesWithCreatorId);
        return opportunitiesWithCreatorId || [];
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
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="h-[400px] animate-pulse bg-gray-100" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EmptyProjects />
      </motion.div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
            ease: [0.23, 1, 0.32, 1]
          }}
        >
          <ProjectCard opportunity={project} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProjectsList;