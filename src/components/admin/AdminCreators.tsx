import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminCreators = () => {
  const [editingCreator, setEditingCreator] = useState<any>(null);

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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('creators')
        .update({
          display_name: editingCreator.display_name,
          location: editingCreator.location,
          bio: editingCreator.bio,
        })
        .eq('id', editingCreator.id);

      if (error) throw error;
      
      await refetch();
      setEditingCreator(null);
      toast.success('Creator updated successfully');
    } catch (error) {
      console.error('Error updating creator:', error);
      toast.error('Failed to update creator');
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
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setEditingCreator(creator)}
                >
                  <Edit2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(creator.id, creator.user_id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingCreator} onOpenChange={() => setEditingCreator(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Creator</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={editingCreator?.display_name || ''}
                onChange={(e) => setEditingCreator({...editingCreator, display_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editingCreator?.location || ''}
                onChange={(e) => setEditingCreator({...editingCreator, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={editingCreator?.bio || ''}
                onChange={(e) => setEditingCreator({...editingCreator, bio: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingCreator(null)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCreators;