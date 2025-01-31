import { ChevronLeft, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CreatorType } from "@/types/creator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import BrowseCreatorProfile from "@/components/creators/modal/BrowseCreatorProfile";

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
  const hasSelectedChat = Boolean(senderFirstName || senderLastName);
  const [isOpen, setIsOpen] = useState(false);

  const { data: creatorData } = useQuery({
    queryKey: ['creator-for-chat', senderUserId],
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

      return creator ? {
        ...creator,
        creator_type: creator.creator_type as CreatorType || 'solo'
      } : null;
    },
    enabled: !!senderUserId
  });

  const initials = hasSelectedChat 
    ? `${senderFirstName?.[0] || ''}${senderLastName?.[0] || ''}`
    : '';

  const fullName = hasSelectedChat 
    ? `${senderFirstName || ''} ${senderLastName || ''}`.trim()
    : 'Messages';

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
            <div className="flex items-center gap-3">
              {hasSelectedChat ? (
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={senderProfileImage || ''} 
                    alt={fullName}
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              ) : null}
              <h1 className="text-2xl font-semibold text-gray-900">
                {fullName}
              </h1>
            </div>
          </div>
          
          {hasSelectedChat && creatorData && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-nino-primary hover:bg-nino-primary/10"
                >
                  <UserPlus className="w-4 h-4" />
                  View Profile
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-full sm:w-[800px]">
                <BrowseCreatorProfile 
                  creator={creatorData}
                  onClose={() => setIsOpen(false)}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
};