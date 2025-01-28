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

  // Fetch campaigns data with applications
  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      console.log('Fetching campaigns data...');
      
      // Get current user's brand ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user?.id)
        .single();
      
      if (brandError) throw brandError;

      // Fetch campaigns with applications and creator data
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
              bio,
              location,
              specialties,
              instagram,
              website,
              creator_type,
              profile_image_url,
              first_name,
              last_name,
              profile:profiles (
                first_name,
                last_name
              )
            )
          )
        `)
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;
      
      console.log('Campaigns fetched:', data?.length);
      return data || [];
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Handle campaign deletion
  const handleDelete = async (campaignId: string) => {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      toast.success('Campaign deleted successfully');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="My Campaigns"
          description="Manage and track all your creator campaigns."
        />
        <div className="mt-8 text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">
            Error loading campaigns. Please try again later.
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