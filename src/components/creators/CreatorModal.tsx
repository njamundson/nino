import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrowseCreatorProfile from "./modal/BrowseCreatorProfile";
import CampaignSelection from "./modal/CampaignSelection";
import { toast } from "sonner";
import { CreatorType } from "@/types/creator";
import { LoadingSpinner } from "../ui/loading-spinner";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  specialties: string[] | null;
  creator_type: CreatorType | null;
  profile_image_url: string | null;
  first_name: string | null;
  last_name: string | null;
}

interface CreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
}

const CreatorModal = ({ creator, isOpen, onClose }: CreatorModalProps) => {
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
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

  const handleInvite = async (opportunityId: string) => {
    if (!creator) return;
    
    try {
      setIsInviting(true);

      const { data: existingInvite, error: checkError } = await supabase
        .from('applications')
        .select('id, status')
        .eq('opportunity_id', opportunityId)
        .eq('creator_id', creator.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing invitation:", checkError);
        toast.error("Failed to check existing invitations");
        return;
      }

      if (existingInvite) {
        if (existingInvite.status === 'invited') {
          toast.error("Creator has already been invited to this campaign");
          return;
        } else if (existingInvite.status === 'accepted') {
          toast.error("Creator is already part of this campaign");
          return;
        }
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
    } finally {
      setIsInviting(false);
    }
  };

  if (!creator) return null;

  const creatorData = {
    id: creator.id,
    bio: creator.bio || '',
    specialties: creator.specialties || [],
    instagram: creator.instagram || '',
    website: creator.website || '',
    location: creator.location || '',
    profile_image_url: creator.profile_image_url,
    creator_type: creator.creator_type as CreatorType || 'solo',
    first_name: creator.first_name,
    last_name: creator.last_name,
    user_id: '', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile_id: null,
    notifications_enabled: true,
    onboarding_completed: true
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl overflow-hidden bg-nino-bg">
        {!showCampaigns ? (
          <div>
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-3xl font-semibold text-nino-text">
                {creator.first_name}
              </DialogTitle>
            </DialogHeader>
            
            <BrowseCreatorProfile 
              creator={creatorData}
              onInviteClick={() => setShowCampaigns(true)}
            />
          </div>
        ) : (
          <CampaignSelection
            campaigns={campaigns}
            onBack={() => setShowCampaigns(false)}
            onSelect={handleInvite}
            isLoading={isInviting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatorModal;