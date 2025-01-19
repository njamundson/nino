import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatHeaderProps {
  senderFirstName?: string;
  senderLastName?: string;
}

export const ChatHeader = ({ senderFirstName, senderLastName }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex justify-between items-center bg-white/50 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
            {senderFirstName?.[0]}
            {senderLastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-nino-text">
            {senderFirstName} {senderLastName}
          </h3>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
          <Phone className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
          <Video className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};