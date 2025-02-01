import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserRound } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Creator } from "@/types/creator";

interface CreatorSectionProps {
  creator: Creator;
  onChatClick: () => void;
  onViewCreator: () => void;
}

const CreatorSection = ({ creator, onChatClick, onViewCreator }: CreatorSectionProps) => {
  const creatorName = creator.display_name;

  return (
    <div className="border-t pt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-gray-900">Booked Creator</h4>
          <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
            Active
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group transition-all duration-200 ease-in-out">
        <div className="flex items-center gap-4">
          {creator.profileImage ? (
            <img 
              src={creator.profileImage}
              alt={creatorName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-nino-primary/10 flex items-center justify-center ring-2 ring-white">
              <span className="text-lg font-medium text-nino-primary">
                {creatorName[0].toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h4 className="font-medium text-gray-900">{creatorName}</h4>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onChatClick}
                  className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat with Creator</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onViewCreator}
                  className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
                >
                  <UserRound className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View Profile</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default CreatorSection;