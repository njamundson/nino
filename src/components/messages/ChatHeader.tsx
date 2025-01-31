import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import CreatorModal from "@/components/creators/CreatorModal";
import { CreatorType } from "@/types/creator";

interface ChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
  senderProfileImage?: string | null;
  senderUserId?: string;
  onMobileBack?: () => void;
}

interface CreatorData {
  id: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  specialties: string[] | null;
  creator_type: CreatorType;
  profile_image_url: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  };
}

const ChatHeader = ({
  senderFirstName,
  senderLastName,
  senderProfileImage,
  senderUserId,
  onMobileBack,
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const hasSelectedChat = Boolean(senderFirstName || senderLastName);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  const { data: creatorData } = useQuery({
    queryKey: ['creator-for-chat', senderUserId],
    queryFn: async () => {
      if (!senderUserId) return null;

      const { data: creator, error } = await supabase
        .from('creators')
        .select(`
          id,
          first_name,
          last_name,
          bio,
          location,
          instagram,
          website,
          specialties,
          creator_type,
          profile_image_url,
          profile:profiles(
            first_name,
            last_name
          )
        `)
        .eq('user_id', senderUserId)
        .single();

      if (error) {
        console.error('Error fetching creator:', error);
        return null;
      }

      return creator as CreatorData;
    },
    enabled: Boolean(senderUserId),
  });

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
              {hasSelectedChat ? `${senderFirstName} ${senderLastName}` : "Select a conversation"}
            </h3>
            {hasSelectedChat && (
              <p className="text-sm text-gray-500 mt-1">
                {creatorData?.location || "Location not specified"}
              </p>
            )}
          </div>
          
          {hasSelectedChat && creatorData && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreatorModalOpen(true)}
              className="gap-2 text-nino-primary hover:bg-nino-primary/10"
            >
              <UserPlus className="w-4 h-4" />
              View Profile
            </Button>
          )}
        </div>
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