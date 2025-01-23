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
import { CreatorData } from "@/types/creator";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  profile?: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  profile_image_url: string | null;
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
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error fetching brand:', brandError);
          toast.error("Failed to load brand information");
          return [];
        }

        if (!brand) {
          console.log('No brand found for user');
          return [];
        }

        const { data: opportunities, error: oppsError } = await supabase
          .from('opportunities')
          .select('*')
          .eq('brand_id', brand.id)
          .eq('status', 'open');

        if (oppsError) {
          console.error('Error fetching opportunities:', oppsError);
          toast.error("Failed to load campaigns");
          return [];
        }

        return opportunities || [];
      } catch (error) {
        console.error('Error in campaign query:', error);
        toast.error("Failed to load campaigns");
        return [];
      }
    },
  });

  if (!creator) return null;

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

  const creatorData: CreatorData = {
    id: creator.id,
    firstName: creator.profile?.first_name || '',
    lastName: creator.profile?.last_name || '',
    bio: creator.bio || '',
    specialties: creator.specialties || [],
    instagram: creator.instagram || '',
    website: creator.website || '',
    location: creator.location || '',
    profileImage: creator.profile_image_url,
    creatorType: 'solo',
    profile: creator.profile,
    profile_image_url: creator.profile_image_url
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl overflow-hidden bg-nino-bg">
        {!showCampaigns ? (
          <div>
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-3xl font-semibold text-nino-text">
                {creator.profile?.first_name}
              </DialogTitle>
            </DialogHeader>
            
            <CreatorProfile 
              creator={creatorData}
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