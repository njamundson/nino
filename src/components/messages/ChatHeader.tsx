import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import CreatorModal from "@/components/creators/CreatorModal";
import { Creator } from "@/types/creator";

interface ChatHeaderProps {
  senderDisplayName?: string;
  senderProfileImage?: string | null;
  senderUserId?: string | null;
  onMobileBack?: () => void;
}

interface ProfileWithBrands {
  id: string;
  display_name: string;
  brands: {
    id: string;
    company_name: string;
  }[] | null;
}

const ChatHeader = ({
  senderDisplayName,
  senderProfileImage,
  senderUserId,
  onMobileBack,
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const hasSelectedChat = Boolean(senderUserId);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  const { data: profileData } = useQuery<ProfileWithBrands | null>({
    queryKey: ['profile-for-chat', senderUserId],
    queryFn: async () => {
      if (!senderUserId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          brands(
            id,
            company_name
          )
        `)
        .eq('id', senderUserId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    },
    enabled: Boolean(senderUserId),
  });

  const { data: creatorData } = useQuery({
    queryKey: ['creator-for-chat', senderUserId],
    queryFn: async () => {
      if (!senderUserId) return null;

      const { data: creator, error } = await supabase
        .from('creators')
        .select(`
          id,
          display_name,
          bio,
          location,
          instagram,
          website,
          specialties,
          creator_type,
          profile_image_url,
          user_id,
          profile:profiles(
            display_name
          )
        `)
        .eq('user_id', senderUserId)
        .single();

      if (error) {
        console.error('Error fetching creator:', error);
        return null;
      }

      return creator as Creator;
    },
    enabled: Boolean(senderUserId),
  });

  const displayName = hasSelectedChat 
    ? profileData?.brands?.[0]?.company_name || creatorData?.display_name || senderDisplayName || "Unknown User"
    : "Select a conversation";

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="h-[72px] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && onMobileBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileBack}
              className="mr-2"
            >
              Back
            </Button>
          )}
          
          <div className="flex flex-col">
            <h3 className="text-sm font-medium leading-none">
              {displayName}
            </h3>
            {hasSelectedChat && creatorData && (
              <p className="text-sm text-gray-500 mt-1">
                {creatorData.location || "Location not specified"}
              </p>
            )}
          </div>
        </div>
        
        {hasSelectedChat && creatorData && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCreatorModalOpen(true)}
            className="text-nino-primary hover:bg-nino-primary/10"
          >
            <UserCircle className="w-5 h-5" />
          </Button>
        )}
      </div>

      {creatorData && (
        <CreatorModal
          creator={creatorData}
          isOpen={isCreatorModalOpen}
          onClose={() => setIsCreatorModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ChatHeader;