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
              className="overflow-hidden backdrop-blur-lg bg-white/80 border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-6 flex-1">
                    <div>
                      <h3 className="text-2xl font-medium text-gray-900 tracking-tight mb-2">
                        {campaign.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {campaign.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          {campaign.location && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-5 text-gray-400">📍</span>
                              {campaign.location}
                            </p>
                          )}
                          {campaign.payment_details && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-5 text-gray-400">💰</span>
                              {campaign.payment_details}
                            </p>
                          )}
                          {campaign.compensation_details && (
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-5 text-gray-400">🎁</span>
                              {campaign.compensation_details}
                            </p>
                          )}
                        </div>

                        {campaign.start_date && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="w-5 text-gray-400">🗓️</span>
                              {format(new Date(campaign.start_date), 'MMM d, yyyy')}
                              {campaign.end_date && (
                                <span className="text-gray-400">→</span>
                              )}
                              {campaign.end_date && format(new Date(campaign.end_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        {campaign.requirements?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
                            <ul className="space-y-1">
                              {campaign.requirements.map((req: string, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <span className="text-gray-400">•</span>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {campaign.deliverables?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Deliverables</h4>
                            <ul className="space-y-1">
                              {campaign.deliverables.map((del: string, index: number) => (
                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                  <span className="text-gray-400">•</span>
                                  {del}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingCampaign(campaign)}
                      className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/80"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingCampaign(campaign.id)}
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-gray-500 bg-white/80 backdrop-blur-lg border-0 shadow-lg rounded-2xl">
          No campaigns found. Create your first campaign to get started!
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