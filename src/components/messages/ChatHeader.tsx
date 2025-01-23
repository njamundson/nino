import { ChevronLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
  profileImageUrl?: string | null;
  onBack?: () => void;
}

export const ChatHeader = ({ 
  senderFirstName, 
  senderLastName,
  profileImageUrl,
  onBack 
}: ChatHeaderProps) => {
  const isMobile = useIsMobile();

  const getInitials = () => {
    return `${senderFirstName?.[0] || ''}${senderLastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="border-b border-gray-100 p-4 bg-white/50 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        {isMobile && onBack && (
          <button 
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarImage src={profileImageUrl || ""} />
          <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-medium text-gray-900">
            {senderFirstName} {senderLastName}
          </h2>
        </div>
      </div>
    </div>
  );
};