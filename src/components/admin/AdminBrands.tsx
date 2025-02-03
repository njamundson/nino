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

const AdminBrands = () => {
  const [editingBrand, setEditingBrand] = useState<any>(null);
  
  const { data: brands, refetch } = useQuery({
    queryKey: ['admin-brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (brandId: string, userId: string) => {
    try {
      const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
      if (deleteError) throw deleteError;
      
      await refetch();
      toast.success('Brand removed successfully');
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to remove brand');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('brands')
        .update({
          company_name: editingBrand.company_name,
          location: editingBrand.location,
          description: editingBrand.description,
        })
        .eq('id', editingBrand.id);

      if (error) throw error;
      
      await refetch();
      setEditingBrand(null);
      toast.success('Brand updated successfully');
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Failed to update brand');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manage Brands</h1>
      
      <div className="grid gap-4">
        {brands?.map((brand) => (
          <Card key={brand.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{brand.company_name}</h3>
                <p className="text-sm text-gray-500">{brand.location}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setEditingBrand(brand)}
                >
                  <Edit2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDelete(brand.id, brand.user_id)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingBrand} onOpenChange={() => setEditingBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                value={editingBrand?.company_name || ''}
                onChange={(e) => setEditingBrand({...editingBrand, company_name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editingBrand?.location || ''}
                onChange={(e) => setEditingBrand({...editingBrand, location: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={editingBrand?.description || ''}
                onChange={(e) => setEditingBrand({...editingBrand, description: e.target.value})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingBrand(null)}>
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

export default AdminBrands;