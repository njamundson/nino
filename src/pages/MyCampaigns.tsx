import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import CampaignCard from "@/components/campaigns/CampaignCard";
import CampaignSkeleton from "@/components/campaigns/CampaignSkeleton";
import EmptyCampaigns from "@/components/campaigns/EmptyCampaigns";
import EditCampaignModal from "@/components/campaigns/EditCampaignModal";
import { motion } from "framer-motion";

const MyCampaigns = () => {
  const [editingCampaign, setEditingCampaign] = useState<any>(null);

  // Fetch campaigns data with improved error handling
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      console.log('Fetching campaigns data...');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('User fetch error:', userError);
        throw userError;
      }

      if (!user) {
        console.error('No user found');
        throw new Error('No authenticated user found');
      }

      // Get brand ID with better error handling
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (brandError) {
        console.error('Brand fetch error:', brandError);
        throw brandError;
      }

      if (!brand) {
        console.error('No brand found for user');
        throw new Error('No brand profile found');
      }

      // Fetch campaigns with related data
      const { data, error: campaignsError } = await supabase
        .from('opportunities')
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          status,
          requirements,
          perks,
          location,
          payment_details,
          compensation_details,
          deliverables,
          image_url,
          created_at,
          applications (
            id,
            status,
            cover_letter,
            creator:creators (
              id,
              profile_image_url,
              user_id,
              profile:profiles (
                first_name,
                last_name
              )
            )
          )
        `)
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false });

      if (campaignsError) {
        console.error('Campaigns fetch error:', campaignsError);
        throw campaignsError;
      }
      
      console.log('Campaigns fetched:', data?.length);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    gcTime: 1000 * 60 * 5, // Keep unused data for 5 minutes
  });

  // Handle campaign deletion with better error feedback
  const handleDelete = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', campaignId);

      if (error) {
        console.error('Delete error:', error);
        toast.error('Failed to delete campaign');
        throw error;
      }

      toast.success('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign. Please try again.');
    }
  };

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="space-y-8">
        <PageHeader
          title="My Campaigns"
          description="Manage and track all your creator campaigns."
        />
        <div className="mt-8 text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Error loading campaigns. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Campaigns"
        description="Manage and track all your creator campaigns."
      />

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <CampaignSkeleton key={i} />
          ))}
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6"
        >
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CampaignCard
                campaign={campaign}
                applications={campaign.applications}
                onEdit={setEditingCampaign}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyCampaigns />
      )}

      {editingCampaign && (
        <EditCampaignModal
          isOpen={!!editingCampaign}
          onClose={() => setEditingCampaign(null)}
          campaign={editingCampaign}
        />
      )}
    </div>
  );
};

export default MyCampaigns;