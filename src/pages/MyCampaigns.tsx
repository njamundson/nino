import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import EditCampaignModal from "@/components/campaigns/EditCampaignModal";
import CampaignCard from "@/components/campaigns/CampaignCard";
import CampaignSkeleton from "@/components/campaigns/CampaignSkeleton";
import EmptyCampaigns from "@/components/campaigns/EmptyCampaigns";
import { useCampaignData } from "@/hooks/campaign/useCampaignData";
import { useCampaignActions } from "@/hooks/campaign/useCampaignActions";
import { motion, AnimatePresence } from "framer-motion";

const MyCampaigns = () => {
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const { data: campaigns, isLoading } = useCampaignData();
  const { handleDelete, handleUpdateApplicationStatus } = useCampaignActions();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Campaigns"
        description="Manage and track all your creator campaigns."
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {[1, 2, 3].map((i) => (
              <CampaignSkeleton key={i} />
            ))}
          </motion.div>
        ) : campaigns && campaigns.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6"
          >
            {campaigns.map((campaign) => (
              <motion.div
                key={campaign.id}
                variants={item}
                layout
              >
                <CampaignCard
                  campaign={campaign}
                  applications={campaign.applications}
                  onEdit={setEditingCampaign}
                  onDelete={handleDelete}
                  onUpdateApplicationStatus={handleUpdateApplicationStatus}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyCampaigns />
          </motion.div>
        )}
      </AnimatePresence>

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