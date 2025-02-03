import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminBrands = () => {
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
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleDelete(brand.id, brand.user_id)}
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

export default AdminBrands;