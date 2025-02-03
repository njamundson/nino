import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building2, Users, FileText } from "lucide-react";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [brands, creators, projects] = await Promise.all([
        supabase.from('brands').select('id', { count: 'exact' }),
        supabase.from('creators').select('id', { count: 'exact' }),
        supabase.from('opportunities').select('id', { count: 'exact' })
      ]);

      return {
        brands: brands.count || 0,
        creators: creators.count || 0,
        projects: projects.count || 0
      };
    }
  });

  const cards = [
    { name: 'Total Brands', value: stats?.brands || 0, icon: Building2 },
    { name: 'Total Creators', value: stats?.creators || 0, icon: Users },
    { name: 'Total Projects', value: stats?.projects || 0, icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[#282828]">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.name} className="p-6 bg-[#FFFFFF] border-[#737373]/10">
              <div className="flex items-center">
                <div className="p-2 bg-[#A55549]/10 rounded-lg">
                  <Icon className="h-6 w-6 text-[#A55549]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#737373]">{card.name}</p>
                  <p className="text-2xl font-semibold text-[#282828]">{card.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;