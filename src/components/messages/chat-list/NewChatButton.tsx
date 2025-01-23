import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Creator {
  id: string;
  profile_id: string;
  profile_image_url: string | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface NewChatButtonProps {
  creators: Creator[];
  onStartChat: (profileId: string) => void;
}

export const NewChatButton = ({ creators = [], onStartChat }: NewChatButtonProps) => {
  // Helper function to get initials safely
  const getInitials = (creator: Creator) => {
    const firstName = creator.profiles?.first_name || '';
    const lastName = creator.profiles?.last_name || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`;
  };

  // Helper function to get full name safely
  const getFullName = (creator: Creator) => {
    const firstName = creator.profiles?.first_name || '';
    const lastName = creator.profiles?.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown Creator';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0">
          <MessageSquarePlus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {creators.map((creator) => (
              <Button
                key={creator.id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => onStartChat(creator.profile_id)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {getInitials(creator)}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {getFullName(creator)}
                </span>
              </Button>
            ))}
            {creators.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No creators found
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};