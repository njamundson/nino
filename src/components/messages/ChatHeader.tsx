import { ChevronLeft, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreatorModal from "@/components/creators/CreatorModal";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
  senderProfileImage?: string | null;
  senderUserId?: string;
  onBack?: () => void;
}

export const ChatHeader = ({ 
  senderFirstName, 
  senderLastName,
  senderProfileImage,
  senderUserId,
  onBack 
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const hasSelectedChat = Boolean(senderFirstName && senderLastName);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  const { data: creatorData } = useQuery({
    queryKey: ['creator-for-invite', senderUserId],
    queryFn: async () => {
      if (!senderUserId) return null;
      
      const { data: creator, error } = await supabase
        .from('creators')
        .select('*')
        .eq('user_id', senderUserId)
        .single();

      if (error) {
        console.error('Error fetching creator:', error);
        return null;
      }

      return creator;
    },
    enabled: !!senderUserId
  });

  const initials = hasSelectedChat 
    ? `${senderFirstName?.[0] || ''}${senderLastName?.[0] || ''}`
    : '';

  return (
    <div className="border-b border-gray-100 p-6 bg-white/50 backdrop-blur-xl">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && onBack && (
              <button 
                onClick={onBack}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {hasSelectedChat ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={senderProfileImage || ''} alt={`${senderFirstName} ${senderLastName}`} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {`${senderFirstName} ${senderLastName}`}
                </h1>
              </div>
            ) : (
              <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
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
              Invite to Campaign
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