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
    first_name: string;
    last_name: string;
  };
}

interface NewChatButtonProps {
  creators: Creator[];
  onStartChat: (profileId: string) => void;
}

export const NewChatButton = ({ creators, onStartChat }: NewChatButtonProps) => {
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
                    {creator.profiles.first_name?.[0]}
                    {creator.profiles.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {creator.profiles.first_name} {creator.profiles.last_name}
                </span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};