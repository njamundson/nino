import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreatorProfile from "./modal/CreatorProfile";
import CampaignSelection from "./modal/CampaignSelection";
import { toast } from "sonner";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  imageUrl: string;
}

interface CreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

const CreatorModal = ({ creator, isOpen, onClose }: CreatorModalProps) => {
  const [showCampaigns, setShowCampaigns] = useState(false);

  const { data: campaigns } = useQuery({
    queryKey: ['brand-campaigns'],
    queryFn: async () => {
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (!brand) return [];

      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .eq('brand_id', brand.id)
        .eq('status', 'open');

      return opportunities || [];
    },
  });

  if (!creator) return null;

  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  const handleInvite = async (opportunityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to invite creators");
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          creator_id: creator.id,
          status: 'invited'
        });

      if (error) {
        console.error("Error inviting creator:", error);
        toast.error("Failed to invite creator");
        return;
      }

      toast.success("Creator invited successfully!");
      setShowCampaigns(false);
      onClose();
    } catch (error) {
      console.error("Error in handleInvite:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl overflow-hidden bg-nino-bg">
        {!showCampaigns ? (
          <div>
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-3xl font-semibold text-nino-text">
                {fullName || 'Anonymous Creator'}
              </DialogTitle>
            </DialogHeader>
            
            <CreatorProfile 
              creator={creator} 
              onInviteClick={() => setShowCampaigns(true)} 
            />
          </div>
        ) : (
          <CampaignSelection
            campaigns={campaigns}
            onBack={() => setShowCampaigns(false)}
            onSelect={handleInvite}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatorModal;