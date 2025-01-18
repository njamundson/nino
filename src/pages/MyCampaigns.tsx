import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import EditCampaignModal from "@/components/campaigns/EditCampaignModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const MyCampaigns = () => {
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        .select(`
          *,
          brand:brands (
            company_name,
            brand_type,
            location
          )
        `)
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });

  const handleDelete = async () => {
    if (!deletingCampaign) return;

    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', deletingCampaign);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    } finally {
      setDeletingCampaign(null);
    }
  };

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
            <Card 
              key={campaign.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50 border-2 rounded-2xl"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-2xl font-semibold mb-2 text-gray-900">{campaign.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{campaign.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      {campaign.location && (
                        <p className="text-sm text-gray-600">📍 Location: {campaign.location}</p>
                      )}
                      {campaign.payment_details && (
                        <p className="text-sm text-gray-600">💰 Payment: {campaign.payment_details}</p>
                      )}
                      {campaign.compensation_details && (
                        <p className="text-sm text-gray-600">🎁 Additional Compensation: {campaign.compensation_details}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      {campaign.start_date && (
                        <p className="text-sm text-gray-600">
                          🗓️ Start: {format(new Date(campaign.start_date), 'MMM d, yyyy')}
                        </p>
                      )}
                      {campaign.end_date && (
                        <p className="text-sm text-gray-600">
                          📅 End: {format(new Date(campaign.end_date), 'MMM d, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>

                  {(campaign.requirements?.length > 0 || campaign.deliverables?.length > 0) && (
                    <div className="grid grid-cols-2 gap-6 mt-4">
                      {campaign.requirements?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {campaign.requirements.map((req: string, index: number) => (
                              <li key={index} className="text-sm text-gray-600">{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {campaign.deliverables?.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Deliverables</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {campaign.deliverables.map((del: string, index: number) => (
                              <li key={index} className="text-sm text-gray-600">{del}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setEditingCampaign(campaign)}
                    className="hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeletingCampaign(campaign.id)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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

      {editingCampaign && (
        <EditCampaignModal
          isOpen={!!editingCampaign}
          onClose={() => setEditingCampaign(null)}
          campaign={editingCampaign}
        />
      )}

      <AlertDialog open={!!deletingCampaign} onOpenChange={() => setDeletingCampaign(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyCampaigns;