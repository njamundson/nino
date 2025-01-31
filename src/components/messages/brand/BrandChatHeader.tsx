import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import CreatorModal from "@/components/creators/CreatorModal";
import { CreatorType } from "@/types/creator";

interface BrandChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
  senderProfileImage?: string | null;
  senderUserId?: string | null;
  onMobileBack?: () => void;
}

interface CreatorData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  specialties: string[] | null;
  creator_type: CreatorType;
  profile_image_url: string | null;
  display_name: string;
}

const BrandChatHeader = ({
  senderFirstName,
  senderLastName,
  senderProfileImage,
  senderUserId,
  onMobileBack,
}: BrandChatHeaderProps) => {
  const isMobile = useIsMobile();
  const hasSelectedChat = Boolean(senderUserId);
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
          display_name
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

  const displayName = hasSelectedChat 
    ? creatorData 
      ? creatorData.display_name
      : `${senderFirstName || ''} ${senderLastName || ''}`
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

export default BrandChatHeader;