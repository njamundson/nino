import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminProjects = () => {
  const { data: projects, refetch } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          brand:brands (
            company_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', projectId);
      
      if (error) throw error;
      
      await refetch();
      toast.success('Project removed successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to remove project');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Projects</h1>
      
      <div className="grid gap-4">
        {projects?.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-gray-500">
                  {project.brand?.company_name} • {project.status}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;