import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface BrandChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
  senderProfileImage?: string | null;
  senderUserId?: string | null;
  onMobileBack?: () => void;
  lastMessageTime?: string;
}

const BrandChatHeader = ({
  senderFirstName,
  senderLastName,
  senderProfileImage,
  senderUserId,
  onMobileBack,
  lastMessageTime,
}: BrandChatHeaderProps) => {
  const fullName = `${senderFirstName || ''} ${senderLastName || ''}`.trim();
  const initials = `${senderFirstName?.[0] || ''}${senderLastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        {onMobileBack && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={onMobileBack}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-8 w-8">
          <AvatarImage src={senderProfileImage || ''} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex items-center justify-between flex-1">
          <h3 className="text-sm font-medium leading-none">
            {fullName}
          </h3>
          {lastMessageTime && (
            <span className="text-xs text-gray-500 ml-2">
              {formatDistanceToNow(new Date(lastMessageTime), { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandChatHeader;