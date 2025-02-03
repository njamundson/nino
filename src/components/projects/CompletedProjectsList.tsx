import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Archive } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { Opportunity } from "@/integrations/supabase/types/opportunity";
import { useState } from "react";
import ProjectModal from "./ProjectModal";
import { motion, AnimatePresence } from "framer-motion";

const CompletedProjectsList = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Opportunity | null>(null);
  
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['completed-projects-list'],
    queryFn: async () => {
      try {
        console.log('Fetching completed projects list...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // First get the brand ID for the current user
        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!brand) {
          console.log("No brand profile found");
          return [];
        }

        // Get all opportunities that are completed and belong to this brand
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
              profile_image_url
            ),
            applications!inner (
              id,
              status,
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

        console.log("Fetched completed projects:", opportunities);
        return opportunities as unknown as Opportunity[];
      } catch (error) {
        console.error("Error in query:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
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

  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <Card className="p-12 border border-gray-100 rounded-2xl bg-white/50 backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="rounded-full bg-gray-100 p-4">
            <Archive className="h-8 w-8 text-gray-400" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              No completed projects yet
            </h3>
            <p className="text-sm text-gray-500">
              When you complete projects with brands, they will appear here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              opportunity={project}
              isCompleted={true}
              onViewDetails={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {selectedProject && (
          <ProjectModal
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
            opportunity={selectedProject}
            isCompleted={true}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CompletedProjectsList;