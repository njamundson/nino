import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const MyCampaigns = () => {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) return [];

      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
    meta: {
      errorBoundary: false
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Campaigns"
        description="Manage and track all your creator campaigns."
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <h3 className="text-lg font-semibold mb-2">{campaign.title}</h3>
              <p className="text-muted-foreground">{campaign.description}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            No campaigns found. Create your first campaign to get started!
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyCampaigns;