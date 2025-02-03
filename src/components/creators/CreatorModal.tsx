import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrowseCreatorProfile from "./modal/BrowseCreatorProfile";
import CampaignSelection from "./modal/CampaignSelection";
import { toast } from "sonner";
import { CreatorType } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  specialties: string[] | null;
  creator_type: CreatorType | null;
  profile_image_url: string | null;
  display_name: string;
}

interface CreatorModalProps {
  creator: Creator | null;
  isOpen: boolean;
  onClose: () => void;
  onMessageClick?: () => void;
}

const CreatorModal = ({ creator, isOpen, onClose, onMessageClick }: CreatorModalProps) => {
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [isInviting, setIsInviting] = useState(false);

  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['brand-campaigns'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be logged in to view campaigns");
          return [];
        }

        // First check if the user is associated with a creator account
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) {
          console.error('Error checking creator status:', creatorError);
          return [];
        }

        if (creator) {
          toast.error("Creators cannot invite other creators to campaigns");
          return [];
        }

        // Then fetch the brand data using maybeSingle
        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error fetching brand:', brandError);
          toast.error("Error fetching brand information");
          return [];
        }

        if (!brand) {
          console.log('No brand found for user');
          toast.error("No brand profile found");
          return [];
        }

        const { data: opportunities, error: oppsError } = await supabase
          .from('opportunities')
          .select(`
            *,
            applications (
              id,
              status,
              creator_id
            )
          `)
          .eq('brand_id', brand.id)
          .eq('status', 'open');

        if (oppsError) {
          console.error('Error fetching opportunities:', oppsError);
          toast.error("Error fetching campaigns");
          return [];
        }

        return opportunities || [];
      } catch (error) {
        console.error('Error in campaign query:', error);
        toast.error("An unexpected error occurred");
        return [];
      }
    },
    enabled: isOpen && showCampaigns,
  });

  const handleInvite = async (opportunityId: string) => {
    if (!creator) return;
    
    try {
      setIsInviting(true);

      // Check for existing application
      const { data: existingApplications, error: checkError } = await supabase
        .from('applications')
        .select('id, status')
        .eq('opportunity_id', opportunityId)
        .eq('creator_id', creator.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing application:", checkError);
        toast.error("Failed to check existing application");
        return;
      }

      if (existingApplications) {
        if (existingApplications.status === 'invited' || existingApplications.status === 'pending') {
          toast.error("Creator has already been invited to this campaign");
          return;
        } else if (existingApplications.status === 'accepted') {
          toast.error("Creator is already part of this campaign");
          return;
        }
        // If application exists but was rejected, we'll allow a new invitation
      }

      // Create the invitation
      const { error: inviteError } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          creator_id: creator.id,
          status: 'invited',
          initiated_by: 'brand'
        });

      if (inviteError) {
        console.error("Error inviting creator:", inviteError);
        if (inviteError.code === '23505') {
          toast.error("Creator has already been invited to this campaign");
        } else {
          toast.error("Failed to invite creator");
        }
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

  const creatorData = mapCreatorData({
    id: creator.id,
    bio: creator.bio || '',
    specialties: creator.specialties || [],
    instagram: creator.instagram || '',
    website: creator.website || '',
    location: creator.location || '',
    profile_image_url: creator.profile_image_url,
    creator_type: creator.creator_type as CreatorType || 'solo',
    display_name: creator.display_name,
    user_id: '', 
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile_id: null,
    notifications_enabled: true,
    onboarding_completed: true,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl overflow-hidden bg-nino-bg">
        {!showCampaigns ? (
          <BrowseCreatorProfile 
            creator={creatorData}
            onInviteClick={() => setShowCampaigns(true)}
            onMessageClick={onMessageClick}
          />
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