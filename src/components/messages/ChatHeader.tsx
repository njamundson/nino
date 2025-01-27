import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
  senderProfileImage?: string | null;
  onBack?: () => void;
}

export const ChatHeader = ({ 
  senderFirstName, 
  senderLastName,
  senderProfileImage,
  onBack 
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();
  const hasSelectedChat = Boolean(senderFirstName && senderLastName);

  const initials = hasSelectedChat 
    ? `${senderFirstName?.[0] || ''}${senderLastName?.[0] || ''}`
    : '';

  return (
    <div className="border-b border-gray-100 p-6 bg-white/50 backdrop-blur-xl">
      <div className="flex flex-col space-y-3">
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
      </div>
    </div>
  );
};