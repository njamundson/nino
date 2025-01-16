import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ProjectCard from "@/components/projects/ProjectCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import PageHeader from "@/components/shared/PageHeader";

const Projects = () => {
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      const { data } = await supabase
        .from('opportunities')
        .select(`
          *,
          brand:brands(*)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      return data;
    }
  });

  if (isLoading) {
    return <div className="p-8">Loading projects...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Available Projects"
        description="Discover and apply to brand collaboration opportunities"
      />
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
          {opportunities?.map((opportunity) => (
            <ProjectCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Projects;