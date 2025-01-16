import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to view projects",
          variant: "destructive",
        });
        return;
      }

      // First get the creator record
      const { data: creatorData, error: creatorError } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        toast({
          title: "Error",
          description: "Failed to load creator profile",
          variant: "destructive",
        });
        return;
      }

      if (!creatorData) {
        toast({
          title: "Profile Not Found",
          description: "Please complete your creator profile first",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Then fetch the projects with brand information
      const { data: projectsData, error: projectsError } = await supabase
        .from('opportunities')
        .select(`
          *,
          applications!inner(*),
          brand:brands(
            company_name,
            brand_type,
            location
          )
        `)
        .eq('applications.creator_id', creatorData.id);

      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        toast({
          title: "Error",
          description: "Failed to load projects",
          variant: "destructive",
        });
        return;
      }

      setProjects(projectsData || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <ProjectsHeader />
      
      {loading ? (
        <div className="text-center">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} opportunity={project} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No projects found. Start by applying to opportunities!
        </div>
      )}

      {isModalOpen && (
        <ProjectModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          opportunity={projects[0]}
        />
      )}
    </div>
  );
};

export default Projects;