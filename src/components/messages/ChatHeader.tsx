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
    </div>
  );
};