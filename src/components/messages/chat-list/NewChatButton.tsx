import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Creator {
  id: string;
  profile_id: string;
  profile_image_url: string | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  };
}

interface NewChatButtonProps {
  creators: Creator[];
  onStartChat: (profileId: string) => void;
}

export const NewChatButton = ({ creators, onStartChat }: NewChatButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {creators.map((creator) => (
          <DropdownMenuItem
            key={creator.id}
            onClick={() => onStartChat(creator.profile_id)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>
                  {creator.profiles?.first_name?.[0]}
                  {creator.profiles?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span>
                {creator.profiles?.first_name} {creator.profiles?.last_name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
        {creators.length === 0 && (
          <DropdownMenuItem disabled>No creators found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};