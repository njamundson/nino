import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminCreators = () => {
  const { data: creators, refetch } = useQuery({
    queryKey: ['admin-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creators')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (creatorId: string, userId: string) => {
    try {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;
      
      await refetch();
      toast.success('Creator removed successfully');
    } catch (error) {
      console.error('Error deleting creator:', error);
      toast.error('Failed to remove creator');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Creators</h1>
      
      <div className="grid gap-4">
        {creators?.map((creator) => (
          <Card key={creator.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{creator.display_name}</h3>
                <p className="text-sm text-gray-500">{creator.location}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(creator.id, creator.user_id)}
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

export default AdminCreators;